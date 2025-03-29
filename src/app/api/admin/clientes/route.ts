import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Buscar clientes em ordem alfabética pelo nome
    const clientes = await prisma.cliente.findMany({
      orderBy: {
        nome: 'asc',
      },
      include: {
        vendas: {
          select: {
            id: true,
          },
        },
      },
    });

    // Mapear os dados para o formato esperado pela interface
    const clientesFormatados = clientes.map(cliente => ({
      id: cliente.id,
      nome: cliente.nome,
      email: cliente.email,
      created_at: cliente.created_at.toISOString(),
      updated_at: cliente.updated_at.toISOString(),
      totalPedidos: cliente.vendas.length,
    }));

    return NextResponse.json(clientesFormatados);
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar clientes' },
      { status: 500 }
    );
  }
} 