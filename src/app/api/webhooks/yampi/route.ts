import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { validateYampiSignature, extractCustomerInfo } from '@/utils/yampi';

// Inicializa a variável global de logs se não existir
if (typeof global.webhookLogs === 'undefined') {
  global.webhookLogs = [];
}

// Limita o número máximo de logs em memória para evitar vazamento de memória
const MAX_MEMORY_LOGS = 100;

// Lista de eventos de pedido suportados conforme documentação da Yampi
const ORDER_EVENTS = [
  'order.paid',
  'order.created', 
  'order.status_updated',
  'order.status.updated',  // Formato alternativo enviado pela Yampi
  'order.updated',
  'order.cancelled',
  'order.cancelled.updated',
  'order.cancel.updated',
  'order.canceled',
  'order.invoiced'  // Adicionar evento de nota fiscal
];

export async function POST(request: Request) {
  const now = new Date();
  let eventType = 'desconhecido';
  let responseCode = 500;
  let responseBody = '';
  let requestBody = {};

  // Log inicial para verificar se a rota está sendo acionada
  console.log(`[${now.toISOString()}] Webhook recebido - iniciando processamento`);

  try {
    // Obter todos os cabeçalhos
    const headers = Object.fromEntries(request.headers.entries());
    
    // Log detalhado de todos os cabeçalhos
    console.log('[Webhook] Cabeçalhos recebidos:', 
      Object.keys(headers).map(k => `${k}: ${headers[k]}`).join('\n'));
    
    // Obter a assinatura do cabeçalho correto conforme documentação
    // https://docs.yampi.com.br/referencia-da-api/webhooks
    const signature = headers['x-yampi-hmac-sha256'] || 
                      headers['X-Yampi-Hmac-SHA256'] ||
                      headers['yampi-hmac-sha256'] ||
                      headers['Yampi-Hmac-SHA256'] ||
                      '';
    
    console.log('[Webhook] Assinatura encontrada:', signature ? `'${signature}'` : 'Nenhuma');
    
    // Obter corpo da requisição como texto para usar na validação da assinatura
    const requestText = await request.clone().text();
    console.log('[Webhook] Corpo da requisição (texto):', requestText.substring(0, 300) + '...');
    
    // Processar corpo da requisição como JSON
    try {
      // Usar outra cópia do request para obter o JSON
      requestBody = await request.json();
    } catch (e) {
      console.error('[Webhook] Erro ao processar JSON:', e);
      try {
        // Tentar como fallback, usando o texto já obtido
        requestBody = JSON.parse(requestText);
      } catch (parseError) {
        console.error('[Webhook] Erro no fallback de parsing JSON:', parseError);
        return NextResponse.json(
          { error: 'Corpo da requisição inválido' },
          { status: 400 }
        );
      }
    }
    
    // Extrair tipo de evento
    eventType = requestBody && typeof requestBody === 'object' && 'event' in requestBody 
      ? requestBody.event as string 
      : 'desconhecido';

    console.log(`[Webhook] Evento identificado: ${eventType}`);

    // Verificar modo de bypass de validação antes de qualquer outra coisa
    const skipValidation = process.env.ALWAYS_ACCEPT_WEBHOOK === 'true';
    
    if (skipValidation) {
      console.log('[Webhook] ATENÇÃO: Validação de assinatura ignorada (ALWAYS_ACCEPT_WEBHOOK=true)');
    } else {
      console.log('[Webhook] Validando assinatura...');
      if (!validateYampiSignature(signature, requestText)) {
        console.error(`[Webhook] Assinatura inválida para o evento: ${eventType}`);
        responseCode = 401;
        responseBody = JSON.stringify({ error: 'Assinatura inválida' });

        // Registrar log em memória antes de retornar erro
        saveLogToMemory({
          event_type: eventType,
          request_body: requestBody,
          response_code: responseCode,
          response_body: responseBody,
          created_at: now
        });

        return NextResponse.json({ error: 'Assinatura inválida' }, { status: 401 });
      }
      console.log('[Webhook] Assinatura válida!');
    }

    // Processa eventos específicos de pedido
    if (ORDER_EVENTS.includes(eventType)) {
      const orderData = typeof requestBody === 'object' && requestBody !== null && 'resource' in requestBody
        ? requestBody.resource
        : null;
      
      if (!orderData) {
        responseCode = 400;
        responseBody = JSON.stringify({ error: 'Dados do pedido ausentes ou inválidos' });
        
        saveLogToMemory({
          event_type: eventType,
          request_body: requestBody,
          response_code: responseCode,
          response_body: responseBody,
          created_at: now
        });
        
        return NextResponse.json(
          { error: 'Dados do pedido ausentes ou inválidos' },
          { status: 400 }
        );
      }
      
      try {
        // Verifica se há um ID de pedido Yampi ou um número de pedido
        const pedidoId = orderData && typeof orderData === 'object' ? 
          ((orderData as any)['id']?.toString() || (orderData as any)['number']?.toString()) : undefined;
        if (!pedidoId) {
          throw new Error('ID do pedido ausente nos dados recebidos');
        }
        
        console.log(`[Webhook] Processando pedido #${pedidoId}`);
        
        // Utiliza a API de sincronização para processar o pedido completamente
        const syncResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/yampi/pedidos/${pedidoId}?force=true`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!syncResponse.ok) {
          const errorText = await syncResponse.text();
          throw new Error(`Falha ao sincronizar pedido via API: ${errorText}`);
        }
        
        const syncResult = await syncResponse.json();
        
        responseCode = 200;
        responseBody = JSON.stringify({
          success: true,
          message: syncResult.mensagem || 'Pedido processado com sucesso',
          data: {
            order_id: pedidoId,
            action: syncResult.atualizado ? 'update' : 'create'
          }
        });
      } catch (dbError) {
        console.error(`Erro ao processar evento de pedido ${eventType}:`, dbError);
        
        // Tentar método alternativo usando a função local se a API falhar
        try {
          console.log(`[Webhook] Tentando método alternativo para processar pedido...`);
          const result = await processOrderEvent(eventType, orderData);
          responseCode = 200;
          responseBody = JSON.stringify(result);
        } catch (fallbackError) {
          console.error(`Erro no método alternativo:`, fallbackError);
          responseCode = 500;
          responseBody = JSON.stringify({ 
            error: 'Erro ao processar evento de pedido',
            message: dbError instanceof Error ? dbError.message : 'Erro desconhecido no processamento'
          });
        }
      }
    } else {
      // Para outros eventos, apenas registramos
      console.log(`Evento não processado: ${eventType}`);
      responseCode = 200;
      responseBody = JSON.stringify({ message: 'Evento registrado, mas não processado' });
    }
    
    // Tenta salvar o log no banco de dados
    try {
      // Verificar se a tabela existe e criar se não existir
      await ensureWebhookLogTable();
      
      await prisma.$executeRaw`
        INSERT INTO webhook_logs 
        (event_type, request_body, response_code, response_body, created_at)
        VALUES 
        (${eventType}, ${Prisma.raw(`to_jsonb('${JSON.stringify(requestBody)}')`)}, ${responseCode}, ${responseBody}, ${now})
      `;
    } catch (logError) {
      console.error('Erro ao salvar log no banco de dados:', logError);
      
      // Salva o log em memória se falhar no banco
      saveLogToMemory({
        event_type: eventType,
        request_body: requestBody,
        response_code: responseCode,
        response_body: responseBody,
        created_at: now
      });
    }

    return NextResponse.json(
      { success: true, message: 'Webhook processado com sucesso' },
      { status: responseCode }
    );

  } catch (error) {
    console.error('Erro ao processar webhook da Yampi:', error);
    responseCode = 500;
    responseBody = JSON.stringify({ error: 'Erro interno' });

    // Registrar o erro em memória
    saveLogToMemory({
      event_type: eventType,
      request_body: requestBody,
      response_code: responseCode,
      response_body: responseBody,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      created_at: now
    });

    return NextResponse.json(
      { error: 'Erro interno ao processar webhook' },
      { status: 500 }
    );
  }
}

// Função para garantir que a tabela de logs existe
async function ensureWebhookLogTable() {
  try {
    // Verificar se a tabela existe
    const tabelas = await prisma.$queryRaw`
      SELECT tablename FROM pg_catalog.pg_tables 
      WHERE schemaname = 'public'
    `;
    
    const tabelasArray = Array.isArray(tabelas) ? tabelas : [];
    const tabelaExiste = tabelasArray.some((t: any) => t.tablename === 'webhook_logs');
    
    if (!tabelaExiste) {
      // Criar tabela se não existir
      await prisma.$executeRaw`
        CREATE TABLE webhook_logs (
          id SERIAL PRIMARY KEY,
          event_type TEXT NOT NULL,
          request_body JSONB NOT NULL,
          response_code INTEGER NOT NULL,
          response_body TEXT NOT NULL,
          created_at TIMESTAMP NOT NULL
        )
      `;
    }
  } catch (error) {
    console.error('Erro ao verificar/criar tabela de logs:', error);
    throw error;
  }
}

// Função para processar eventos de pedido
async function processOrderEvent(eventType: string, orderData: any) {
  try {
    if (!orderData) {
      throw new Error('Dados do pedido ausentes');
    }

    // Primeiro, extraímos os dados do cliente
    const customerData = extractCustomerInfo(orderData);
    if (!customerData) {
      throw new Error('Dados do cliente ausentes no pedido');
    }

    // Verificar se o cliente já existe
    let cliente = await prisma.cliente.findUnique({
      where: {
        email: customerData.email
      }
    });

    // Se o cliente não existir, criar um novo
    if (!cliente) {
      cliente = await prisma.cliente.create({
        data: {
          nome: customerData.nome,
          email: customerData.email
        }
      });
      console.log(`Novo cliente criado: ${cliente.nome} (${cliente.id})`);
    }

    // Mapear o status da Yampi para o status interno
    let statusInterno;
    const statusId = orderData.status?.id;
    
    switch (statusId) {
      case 1: // Aguardando pagamento
      case 8: // Aguardando pagamento
        statusInterno = 'pending';
        break;
      case 2: // Pagamento aprovado
      case 3: // Em processamento
      case 9: // Pagamento confirmado
        statusInterno = 'paid';
        break;
      case 4: // Enviado
      case 5: // Em transporte
      case 11: // Objeto postado
        statusInterno = 'shipping';
        break;
      case 6: // Entregue
        statusInterno = 'delivered';
        break;
      case 7: // Cancelado
      case 10: // Cancelado
        statusInterno = 'canceled';
        break;
      default:
        // Se o status não for reconhecido, verificamos pelo nome do status
        if (orderData.status && typeof orderData.status === 'object') {
          const statusName = orderData.status.name?.toLowerCase() || '';
          if (statusName.includes('cancel')) {
            statusInterno = 'canceled';
          } else if (statusName.includes('pag') || statusName.includes('aguard')) {
            statusInterno = 'pending';
          } else if (statusName.includes('aprovado') || statusName.includes('confirm')) {
            statusInterno = 'paid';
          } else if (statusName.includes('transporte') || statusName.includes('envi')) {
            statusInterno = 'shipping';
          } else if (statusName.includes('entreg')) {
            statusInterno = 'delivered';
          } else {
            statusInterno = 'pending';
          }
        } else {
          statusInterno = 'pending';
        }
    }

    // Calcular valores
    const valorTotal = parseFloat(orderData.total) || 0;
    const valorFrete = parseFloat(orderData.freight_cost) || 0;
    const valorDesconto = parseFloat(orderData.discount) || 0;
    
    // Determinar o método de pagamento
    let metodoPagamento = 'other';
    let parcelas = 1;
    
    if (orderData.payment_method) {
      if (orderData.payment_method.includes('credit')) {
        metodoPagamento = 'credit_card';
        // Tentar extrair o número de parcelas
        const parcelasMatch = orderData.payment_method.match(/(\d+)x/);
        if (parcelasMatch && parcelasMatch[1]) {
          parcelas = parseInt(parcelasMatch[1]);
        }
      } else if (orderData.payment_method.includes('boleto')) {
        metodoPagamento = 'boleto';
      } else if (orderData.payment_method.includes('pix')) {
        metodoPagamento = 'pix';
      }
    }
    
    // Obter informações de rastreamento, se disponíveis
    let rastreamento = null;
    let urlRastreamento = null;
    
    if (orderData.shipment && orderData.shipment.tracking_code) {
      rastreamento = orderData.shipment.tracking_code;
      urlRastreamento = orderData.shipment.tracking_url || 'https://rastreamento.correios.com.br';
    } 
    // Para pedidos em formato de etiqueta
    else if (orderData.labels && Array.isArray(orderData.labels) && orderData.labels.length > 0) {
      const lastLabel = orderData.labels[orderData.labels.length - 1];
      rastreamento = lastLabel.tracking_code || lastLabel.code || null;
      urlRastreamento = lastLabel.tracking_url || 'https://rastreamento.correios.com.br';
    }
    // Para pedidos com objeto de tracking direto na raiz
    else if (orderData.tracking_code) {
      rastreamento = orderData.tracking_code;
      urlRastreamento = orderData.tracking_url || 'https://rastreamento.correios.com.br';
    }
    
    // Extrair informações de endereço, se disponíveis
    let endereco = null;
    if (orderData.shipping_address) {
      endereco = {
        rua: orderData.shipping_address.street || '',
        numero: orderData.shipping_address.number || '',
        complemento: orderData.shipping_address.complement || '',
        bairro: orderData.shipping_address.neighborhood || '',
        cidade: orderData.shipping_address.city || '',
        estado: orderData.shipping_address.state || '',
        cep: orderData.shipping_address.zipcode || '',
        destinatario: orderData.shipping_address.receiver || '',
        pais: orderData.shipping_address.country || 'Brasil'
      };
    }

    // Extrair informações de itens, se disponíveis
    let itensPedido = null;
    if (orderData.items && Array.isArray(orderData.items) && orderData.items.length > 0) {
      itensPedido = orderData.items.map((item: any) => ({
        produto_id: item.product_id || null,
        sku_id: item.sku_id || null,
        sku: item.sku || '',
        nome: item.name || '',
        quantidade: item.quantity || 1,
        preco: parseFloat(item.price) || 0,
        preco_total: parseFloat(item.subtotal) || 0,
      }));
    }
    
    // Dados do pedido
    const dadosPedido = {
      pedido_id: orderData.number.toString(),
      status: statusInterno,
      valor_total: valorTotal,
      cliente_id: cliente.id,
      valor_frete: valorFrete,
      valor_desconto: valorDesconto,
      metodo_pagamento: metodoPagamento,
      parcelas: parcelas,
      rastreamento: rastreamento,
      url_rastreamento: urlRastreamento,
      // Trata a data de criação com validação
      data_criacao: orderData.created_at && !isNaN(new Date(orderData.created_at).getTime()) 
        ? new Date(orderData.created_at) 
        : new Date(),
      data_atualizacao: new Date(),
      // Novos campos de integração com a Yampi
      yampi_id: (orderData.id as any)?.toString() || null,
      yampi_status_id: statusId || null,
      shipment_service: orderData.shipment_service || orderData.shipping_service || null,
      forma_pagamento: orderData.payment_method || null,
      endereco_entrega: endereco ? endereco : undefined,
      itens_pedido: itensPedido ? itensPedido : undefined,
      gateway_pagamento: orderData.gateway || null,
      observacoes: orderData.observation || null
    };
    
    // Verificar se o pedido já existe
    const pedidoExistente = await prisma.venda.findUnique({
      where: {
        pedido_id: orderData.number.toString()
      }
    });
    
    // Se o pedido já existir, atualizá-lo; caso contrário, criar um novo
    if (pedidoExistente) {
      await prisma.venda.update({
        where: {
          pedido_id: orderData.number.toString()
        },
        data: dadosPedido
      });
      console.log(`Pedido #${orderData.number} atualizado`);
      return { 
        success: true, 
        message: 'Pedido atualizado com sucesso', 
        order_id: orderData.number,
        action: 'update'
      };
    } else {
      await prisma.venda.create({
        data: dadosPedido
      });
      console.log(`Pedido #${orderData.number} criado`);
      return { 
        success: true, 
        message: 'Pedido criado com sucesso', 
        order_id: orderData.number,
        action: 'create'
      };
    }

  } catch (error) {
    console.error(`Erro ao processar evento ${eventType}:`, error);
    throw error;
  }
}

// Função para salvar logs em memória
function saveLogToMemory(logData: any) {
  // Inicializa a variável global se necessário
  if (typeof global.webhookLogs === 'undefined') {
    global.webhookLogs = [];
  }
  
  // Adiciona o log à lista
  global.webhookLogs.push(logData);
  
  // Limita o tamanho da lista para evitar vazamento de memória
  if (global.webhookLogs.length > MAX_MEMORY_LOGS) {
    global.webhookLogs = global.webhookLogs.slice(-MAX_MEMORY_LOGS);
  }
} 