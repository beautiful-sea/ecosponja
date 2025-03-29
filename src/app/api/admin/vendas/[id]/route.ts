import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // Validar ID
    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { error: 'ID de venda inválido' },
        { status: 400 }
      );
    }

    // Buscar venda pelo ID
    const venda = await prisma.venda.findUnique({
      where: {
        id,
      },
      include: {
        cliente: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
      },
    });

    if (!venda) {
      return NextResponse.json(
        { error: 'Venda não encontrada' },
        { status: 404 }
      );
    }

    // Converter para o formato esperado pela interface
    const vendaFormatada = {
      id: venda.id,
      numeroPedido: venda.pedido_id,
      statusPedido: venda.status,
      valorTotal: venda.valor_total,
      dataPedido: venda.data_criacao.toISOString(),
      dataAtualizacao: venda.data_atualizacao?.toISOString(),
      cliente: {
        id: venda.cliente.id,
        nome: venda.cliente.nome,
        email: venda.cliente.email,
      },
      valorFrete: venda.valor_frete,
      valorDesconto: venda.valor_desconto,
      metodoPagamento: venda.metodo_pagamento,
      parcelas: venda.parcelas,
      codigoRastreio: venda.rastreamento,
      urlRastreio: venda.url_rastreamento,
      yampiId: venda.yampi_id,
      yampiStatusId: venda.yampi_status_id,
      servicoEnvio: venda.shipment_service,
      formaPagamento: venda.forma_pagamento,
      endereco: venda.endereco_entrega,
      itens: venda.itens_pedido || [],
      gatewayPagamento: venda.gateway_pagamento,
      observacoes: venda.observacoes,
      produtos: venda.itens_pedido ? venda.itens_pedido.map((item: any) => ({
        id: item.produto_id || `sku-${item.sku_id || ''}`,
        nome: item.nome || 'Produto',
        sku: item.sku || '',
        quantidade: item.quantidade || 1,
        precoUnitario: item.preco || 0,
        precoTotal: item.preco_total || 0,
      })) : [],
    };

    return NextResponse.json(vendaFormatada);
  } catch (error) {
    console.error('Erro ao buscar detalhes da venda:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar detalhes da venda' },
      { status: 500 }
    );
  }
} 