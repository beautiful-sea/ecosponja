import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Buscar vendas em ordem decrescente de data_criacao (mais recentes primeiro)
    const vendas = await prisma.venda.findMany({
      orderBy: {
        data_criacao: 'desc',
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

    // Mapear os dados para o formato esperado pela interface
    const vendasFormatadas = vendas.map(venda => ({
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
      itens: venda.itens_pedido,
      gatewayPagamento: venda.gateway_pagamento,
      observacoes: venda.observacoes,
    }));

    return NextResponse.json(vendasFormatadas);
  } catch (error) {
    console.error('Erro ao buscar vendas:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar vendas' },
      { status: 500 }
    );
  }
} 