import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { fetchYampiOrders } from '@/utils/yampi';
import { getYampiToken } from '@/utils/yampi';

// Endpoint para listar pedidos
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    
    // Busca pedidos diretamente da API da Yampi
    const pedidosYampi = await fetchYampiOrders(page, limit);
    
    return NextResponse.json(pedidosYampi);
  } catch (error) {
    console.error('Erro ao processar pedidos da Yampi:', error);
    return NextResponse.json(
      { 
        error: 'Erro ao processar pedidos', 
        message: error instanceof Error ? error.message : 'Erro desconhecido' 
      },
      { status: 500 }
    );
  }
} 