import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { extractCustomerInfo, fetchYampiOrder } from '@/utils/yampi';
import { Prisma } from '@prisma/client';

// Endpoint para buscar um pedido específico
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const url = new URL(request.url);
    const forceSync = url.searchParams.get('force') === 'true';
    
    console.log(`Buscando pedido ${id} (forceSync: ${forceSync})`);
    
    // Verifica primeiro se o pedido já existe no banco, a menos que force=true
    let pedidoExistente = null;
    if (!forceSync) {
      pedidoExistente = await prisma.venda.findFirst({
        where: {
          OR: [
            { pedido_id: id },
            { yampi_id: id }
          ]
        },
        include: {
          cliente: true
        }
      });
    }
    
    // Se o pedido não existir localmente ou force=true, busca da API da Yampi e importa
    if (!pedidoExistente || forceSync) {
      const pedidoYampi = await fetchYampiOrder(id);
      
      if (!pedidoYampi || !pedidoYampi.data) {
        return NextResponse.json(
          { error: 'Pedido não encontrado na Yampi' },
          { status: 404 }
        );
      }
      
      const orderData = pedidoYampi.data;
      
      // Extrair dados do cliente
      const customerData = extractCustomerInfo(orderData);
      
      // Verificar se cliente já existe ou criar novo
      let cliente = null;
      if (customerData.email) {
        cliente = await prisma.cliente.findUnique({
          where: { email: customerData.email }
        });
      }
      
      if (!cliente && customerData.email) {
        cliente = await prisma.cliente.create({
          data: {
            nome: customerData.nome,
            email: customerData.email
          }
        });
      } else if (!cliente) {
        // Cliente sem email, cria um temporário
        cliente = await prisma.cliente.create({
          data: {
            nome: customerData.nome || 'Cliente sem nome',
            email: `cliente-yampi-${Date.now()}@temporario.com`
          }
        });
      }
      
      // Mapear o status
      let statusInterno = 'pending';
      if (orderData.status) {
        const statusId = typeof orderData.status === 'object' ? orderData.status.id : null;
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
      
      // Extrair método de pagamento e parcelas
      let metodoPagamento = 'other';
      let parcelas = 1;
      let formaPagamento = orderData.payment_method || null;
      
      if (orderData.transactions && orderData.transactions.data && 
          orderData.transactions.data.length > 0) {
        const transaction = orderData.transactions.data[0];
        formaPagamento = transaction.payment || formaPagamento;
        parcelas = transaction.installments || parcelas;
        
        if (transaction.payment_method === 'credit_card') {
          metodoPagamento = 'credit_card';
        } else if (transaction.payment_method === 'boleto') {
          metodoPagamento = 'boleto';
        } else if (transaction.payment_method === 'pix') {
          metodoPagamento = 'pix';
        }
      } else if (formaPagamento) {
        if (formaPagamento.includes('credit')) {
          metodoPagamento = 'credit_card';
          const parcelasMatch = formaPagamento.match(/(\d+)x/);
          if (parcelasMatch && parcelasMatch[1]) {
            parcelas = parseInt(parcelasMatch[1]);
          }
        } else if (formaPagamento.includes('boleto')) {
          metodoPagamento = 'boleto';
        } else if (formaPagamento.includes('pix')) {
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
        itensPedido = orderData.items.data.map(item => ({
          produto_id: item.product_id || null,
          sku_id: item.sku_id || null,
          sku: item.sku || '',
          nome: item.name || '',
          quantidade: item.quantity || 1,
          preco: parseFloat(item.price) || 0,
          preco_total: parseFloat(item.subtotal) || 0,
        }));
      }
      
      // Se pedido já existe e estamos atualizando
      if (pedidoExistente && forceSync) {
        // Atualizar o pedido no banco de dados
        pedidoExistente = await prisma.venda.update({
          where: {
            id: pedidoExistente.id
          },
          data: {
            status: statusInterno,
            valor_total: valorTotal,
            valor_frete: valorFrete,
            valor_desconto: valorDesconto,
            metodo_pagamento: metodoPagamento,
            parcelas: parcelas,
            rastreamento: rastreamento,
            url_rastreamento: urlRastreamento,
            data_atualizacao: new Date(),
            yampi_id: orderData.id?.toString() || null,
            yampi_status_id: typeof orderData.status === 'object' ? orderData.status.id : null,
            shipment_service: orderData.shipment_service || orderData.shipping_service || null,
            forma_pagamento: formaPagamento,
            endereco_entrega: endereco ? Prisma.JsonValue(endereco) : undefined,
            itens_pedido: itensPedido ? Prisma.JsonValue(itensPedido) : undefined,
            gateway_pagamento: orderData.gateway || null,
            observacoes: orderData.observation || null
          },
          include: {
            cliente: true
          }
        });
        
        return NextResponse.json({
          pedido: pedidoExistente,
          atualizado: true,
          mensagem: 'Pedido atualizado com sucesso da Yampi'
        });
      }
      
      // Se pedido não existe, cria um novo
      if (!pedidoExistente) {
        pedidoExistente = await prisma.venda.create({
          data: {
            pedido_id: orderData.number?.toString() || id.toString(),
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
            forma_pagamento: formaPagamento,
            endereco_entrega: endereco ? Prisma.JsonValue(endereco) : undefined,
            itens_pedido: itensPedido ? Prisma.JsonValue(itensPedido) : undefined,
            gateway_pagamento: orderData.gateway || null,
            observacoes: orderData.observation || null
          },
          include: {
            cliente: true
          }
        });
        
        return NextResponse.json({
          pedido: pedidoExistente,
          importado: true,
          mensagem: 'Pedido importado com sucesso da Yampi'
        });
      }
    }
    
    // Retorna o pedido existente
    return NextResponse.json({
      pedido: pedidoExistente,
      importado: false
    });
  } catch (error) {
    console.error(`Erro ao buscar pedido:`, error);
    return NextResponse.json(
      { 
        error: 'Erro ao buscar pedido', 
        message: error instanceof Error ? error.message : 'Erro desconhecido' 
      },
      { status: 500 }
    );
  }
} 