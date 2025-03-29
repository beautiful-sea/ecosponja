import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { extractCustomerInfo, getYampiToken } from '@/utils/yampi';
import { Prisma } from '@prisma/client';

// Função para buscar pedidos da Yampi
async function fetchYampiOrders(page = 1, limit = 50) {
  try {
    const token = await getYampiToken();
    if (!token) {
      throw new Error('Não foi possível obter token de autenticação da Yampi');
    }
    
    const alias = process.env.YAMPI_ALIAS;
    
    if (!alias) {
      throw new Error('Alias da loja Yampi não configurado');
    }
    
    // Autenticação Basic conforme documentação da Yampi
    const authorization = `Basic ${Buffer.from(token).toString('base64')}`;
    
    // Conforme documentação: https://docs.yampi.com.br/referencia-da-api/pedidos
    const endpoint = `https://api.dooki.com.br/v2/${alias}/orders?page=${page}&limit=${limit}&include=items,customer,status,shipping_address,transactions`;
    
    console.log(`Importando pedidos da Yampi: ${endpoint}`);
    
    const response = await fetch(endpoint, {
      headers: {
        'Authorization': authorization,
        'Content-Type': 'application/json',
        'User-Agent': 'EcoSponja API Client/1.0'
      },
    });
    
    if (!response.ok) {
      throw new Error(`Erro ao buscar pedidos: ${response.status} - ${await response.text()}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar pedidos da Yampi:', error);
    throw error;
  }
}

// Função para processar um pedido da Yampi e salvar no banco
async function processYampiOrder(orderData: any) {
  try {
    // Verificar se o pedido já existe
    const pedidoExistente = await prisma.venda.findFirst({
      where: {
        OR: [
          { pedido_id: orderData.number?.toString() },
          { yampi_id: orderData.id?.toString() }
        ]
      }
    });
    
    // Se o pedido já existir, pula
    if (pedidoExistente) {
      return {
        status: 'skipped',
        pedido_id: orderData.number,
        yampi_id: orderData.id
      };
    }
    
    // Extrair dados do cliente
    const customerData = extractCustomerInfo(orderData);
    
    if (!customerData || !customerData.email) {
      return {
        status: 'error',
        message: 'Dados do cliente ausentes ou inválidos',
        pedido_id: orderData.number,
        yampi_id: orderData.id
      };
    }
    
    // Verificar se cliente já existe ou criar novo
    let cliente = await prisma.cliente.findUnique({
      where: { email: customerData.email }
    });
    
    if (!cliente) {
      cliente = await prisma.cliente.create({
        data: {
          nome: customerData.nome,
          email: customerData.email
        }
      });
    }
    
    // Mapear o status
    let statusInterno = 'pending';
    let statusId = null;
    
    if (orderData.status) {
      statusId = typeof orderData.status === 'object' ? orderData.status.id : null;
      const statusName = typeof orderData.status === 'object' ? 
        (orderData.status.name || '').toLowerCase() : '';
      
      if (statusId === 2 || statusId === 3 || statusId === 9 || 
          statusName.includes('aprovado') || statusName.includes('pago')) {
        statusInterno = 'paid';
      } else if (statusId === 4 || statusId === 5 || statusId === 11 || 
                statusName.includes('transporte') || statusName.includes('envi')) {
        statusInterno = 'shipping';
      } else if (statusId === 6 || statusName.includes('entreg')) {
        statusInterno = 'delivered';
      } else if (statusId === 7 || statusId === 10 || statusName.includes('cancel')) {
        statusInterno = 'canceled';
      }
    }
    
    // Extrair valores
    const valorTotal = parseFloat(orderData.total) || 0;
    const valorFrete = parseFloat(orderData.freight_cost) || 0;
    const valorDesconto = parseFloat(orderData.discount) || 0;
    
    // Extrair método de pagamento
    let metodoPagamento = 'other';
    let parcelas = 1;
    
    if (orderData.payment_method) {
      if (orderData.payment_method.includes('credit')) {
        metodoPagamento = 'credit_card';
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
    
    // Extrair informações de rastreamento
    let rastreamento = null;
    let urlRastreamento = null;
    
    if (orderData.shipment && orderData.shipment.tracking_code) {
      rastreamento = orderData.shipment.tracking_code;
      urlRastreamento = orderData.shipment.tracking_url || 'https://rastreamento.correios.com.br';
    } else if (orderData.labels && Array.isArray(orderData.labels) && 
              orderData.labels.length > 0) {
      const lastLabel = orderData.labels[orderData.labels.length - 1];
      rastreamento = lastLabel.tracking_code || lastLabel.code || null;
      urlRastreamento = lastLabel.tracking_url || 'https://rastreamento.correios.com.br';
    } else if (orderData.tracking_code) {
      rastreamento = orderData.tracking_code;
      urlRastreamento = orderData.tracking_url || 'https://rastreamento.correios.com.br';
    }
    
    // Extrair endereço de entrega
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
    
    // Extrair itens do pedido
    let itensPedido = null;
    if (orderData.items && orderData.items.data && 
        Array.isArray(orderData.items.data) && orderData.items.data.length > 0) {
      itensPedido = orderData.items.data.map((item: any) => ({
        produto_id: item.product_id || null,
        sku_id: item.sku_id || null,
        sku: item.sku || '',
        nome: item.name || '',
        quantidade: item.quantity || 1,
        preco: parseFloat(item.price) || 0,
        preco_total: parseFloat(item.subtotal) || 0,
      }));
    }
    
    // Criar o pedido no banco
    const novoPedido = await prisma.venda.create({
      data: {
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
        data_criacao: orderData.created_at && !isNaN(new Date(orderData.created_at).getTime()) 
          ? new Date(orderData.created_at) 
          : new Date(),
        data_atualizacao: new Date(),
        yampi_id: orderData.id?.toString() || null,
        yampi_status_id: typeof orderData.status === 'object' ? orderData.status.id : null,
        shipment_service: orderData.shipment_service || orderData.shipping_service || null,
        forma_pagamento: orderData.payment_method || null,
        endereco_entrega: endereco || undefined,
        itens_pedido: itensPedido || undefined,
        gateway_pagamento: orderData.gateway || null,
        observacoes: orderData.observation || null
      }
    });
    
    return {
      status: 'success',
      pedido_id: novoPedido.pedido_id,
      id: novoPedido.id
    };
  } catch (error) {
    console.error(`Erro ao processar pedido ${orderData?.number}:`, error);
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Erro desconhecido',
      pedido_id: orderData?.number,
      yampi_id: orderData?.id
    };
  }
}

// Endpoint para importar pedidos
export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const maxPages = parseInt(url.searchParams.get('max_pages') || '10');
    
    // Resultados da importação
    const resultados = {
      sucesso: 0,
      erros: 0,
      ignorados: 0,
      detalhes: [] as any[]
    };
    
    // Buscar pedidos da página especificada
    const pedidosResponse = await fetchYampiOrders(page, limit);
    const totalPages = pedidosResponse.meta?.last_page || 1;
    const pagesToProcess = Math.min(maxPages, totalPages - page + 1);
    
    // Processar página por página
    for (let currentPage = page; currentPage < page + pagesToProcess; currentPage++) {
      // Se não for a primeira página, buscar os pedidos da página atual
      const pageData = currentPage === page 
        ? pedidosResponse 
        : await fetchYampiOrders(currentPage, limit);
      
      if (!pageData.data || !Array.isArray(pageData.data)) {
        console.error(`Não foi possível obter pedidos da página ${currentPage}`);
        continue;
      }
      
      console.log(`Processando página ${currentPage} de ${totalPages}...`);
      
      // Processar cada pedido da página
      for (const orderData of pageData.data) {
        const resultado = await processYampiOrder(orderData);
        resultados.detalhes.push(resultado);
        
        if (resultado.status === 'success') {
          resultados.sucesso++;
        } else if (resultado.status === 'error') {
          resultados.erros++;
        } else {
          resultados.ignorados++;
        }
      }
    }
    
    return NextResponse.json({
      success: true,
      message: `Importação concluída: ${resultados.sucesso} pedidos importados, ${resultados.ignorados} ignorados, ${resultados.erros} erros`,
      pagination: {
        page,
        page_size: limit,
        total_pages: totalPages,
        pages_processed: pagesToProcess
      },
      resultados
    });
  } catch (error) {
    console.error('Erro na importação de pedidos:', error);
    return NextResponse.json(
      { 
        error: 'Erro ao importar pedidos', 
        message: error instanceof Error ? error.message : 'Erro desconhecido' 
      },
      { status: 500 }
    );
  }
} 