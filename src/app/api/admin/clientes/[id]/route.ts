import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const clienteId = params.id;

    // Busca o cliente com seus pedidos
    const cliente = await prisma.cliente.findUnique({
      where: { id: clienteId },
      include: {
        vendas: {
          orderBy: {
            data_criacao: 'desc',
          },
        },
      },
    });

    if (!cliente) {
      return NextResponse.json(
        { error: 'Cliente não encontrado' },
        { status: 404 }
      );
    }

    // Mapear os dados para o formato esperado pela interface
    const clienteFormatado = {
      id: cliente.id,
      nome: cliente.nome,
      email: cliente.email,
      created_at: cliente.created_at.toISOString(),
      updated_at: cliente.updated_at.toISOString(),
      pedidos: cliente.vendas.map(venda => ({
        id: venda.id,
        numeroPedido: venda.pedido_id,
        statusPedido: venda.status,
        valorTotal: venda.valor_total,
        dataPedido: venda.data_criacao.toISOString(),
        dataAtualizacao: venda.data_atualizacao?.toISOString(),
        valorFrete: venda.valor_frete,
        valorDesconto: venda.valor_desconto,
        metodoPagamento: venda.metodo_pagamento,
        parcelas: venda.parcelas,
        codigoRastreio: venda.rastreamento,
        urlRastreio: venda.url_rastreamento,
        yampiId: venda.yampi_id,
        yampiStatusId: venda.yampi_status_id,
      })),
    };

    return NextResponse.json(clienteFormatado);
  } catch (error) {
    console.error('Erro ao buscar detalhes do cliente:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar detalhes do cliente' },
      { status: 500 }
    );
  }
} 