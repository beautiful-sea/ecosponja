import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { fetchYampiOrders } from '@/utils/yampi';

// Função para buscar pedidos da Yampi
async function fetchYampiOrders(page = 1, limit = 20) {
  try {
    const token = await getYampiToken();
    if (!token) {
      throw new Error('Não foi possível obter token de autenticação da Yampi');
    }
    
    const alias = process.env.YAMPI_ALIAS;
    
    if (!alias) {
      throw new Error('Alias da loja Yampi não configurado');
    }
    
    // Autenticação Bearer conforme documentação da Yampi
    const authorization = `Bearer ${token}`;
    
    // Conforme documentação: https://docs.yampi.com.br/referencia-da-api/pedidos
    const endpoint = `https://api.dooki.com.br/v2/${alias}/orders?page=${page}&limit=${limit}&include=items,customer,status,shipping_address,transactions`;
    
    console.log(`Buscando pedidos da Yampi: ${endpoint}`);
    
    const response = await fetch(endpoint, {
      headers: {
        'Authorization': authorization,
        'Content-Type': 'application/json',
        'User-Agent': 'EcoSponja API Client/1.0'
      },
    });
    
    if (!response.ok) {
      console.error(`Erro na API Dooki: ${response.status} - ${await response.text()}`);
      
      // Tentar API alternativa se a principal falhar
      console.log("Tentando API alternativa da Yampi");
      const altEndpoint = `https://api.yampi.com.br/v1/orders?page=${page}&limit=${limit}&include=items,customer,status,shipping_address,transactions`;
      
      const altResponse = await fetch(altEndpoint, {
        headers: {
          'Authorization': authorization,
          'Content-Type': 'application/json',
          'User-Agent': 'EcoSponja API Client/1.0'
        },
      });
      
      if (altResponse.ok) {
        return await altResponse.json();
      }
      
      throw new Error(`Erro em ambas as APIs ao buscar pedidos. Dooki: ${response.status}, Yampi: ${altResponse.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar pedidos da Yampi:', error);
    throw error;
  }
}

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