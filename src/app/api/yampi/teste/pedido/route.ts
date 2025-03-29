import { NextResponse } from 'next/server';
import { getYampiToken } from '@/utils/yampi';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const pedidoId = url.searchParams.get('id');
    
    if (!pedidoId) {
      return NextResponse.json(
        { error: 'ID do pedido não fornecido. Use ?id=NUMERO_PEDIDO' }, 
        { status: 400 }
      );
    }
    
    const token = await getYampiToken();
    const alias = process.env.YAMPI_ALIAS;
    
    if (!token) {
      return NextResponse.json({ error: 'Falha ao obter token de autenticação' }, { status: 401 });
    }
    
    if (!alias) {
      return NextResponse.json({ error: 'Alias da loja não configurado' }, { status: 400 });
    }
    
    // Autenticação Bearer conforme documentação da Yampi
    const authorization = `Bearer ${token}`;
    
    console.log(`Testando busca do pedido ${pedidoId} usando token: ${token.substring(0, 5)}...`);
    
    const resultados = [];
    let sucessoGeral = false;
    
    // Método 1: Busca direta pelo ID/número (API Dooki)
    const endpoint1 = `https://api.dooki.com.br/v2/${alias}/orders/${pedidoId}`;
    try {
      console.log(`Método 1 - Testando: ${endpoint1}`);
      const response1 = await fetch(endpoint1, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authorization,
          'User-Agent': 'EcoSponja API Client/1.0'
        }
      });
      
      const dados1 = response1.ok ? await response1.json() : await response1.text();
      console.log(`Método 1 - Status: ${response1.status}, Sucesso: ${response1.ok}`);
      
      resultados.push({
        metodo: 'Busca direta pelo ID (Dooki)',
        url: endpoint1,
        status: response1.status,
        sucesso: response1.ok,
        dados: dados1
      });
      
      if (response1.ok) {
        sucessoGeral = true;
      }
    } catch (error) {
      console.error(`Método 1 - Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      resultados.push({
        metodo: 'Busca direta pelo ID (Dooki)',
        url: endpoint1,
        erro: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
    
    // Método 2: Busca por filtro de número (API Dooki)
    const endpoint2 = `https://api.dooki.com.br/v2/${alias}/orders?q[number]=${pedidoId}`;
    try {
      console.log(`Método 2 - Testando: ${endpoint2}`);
      const response2 = await fetch(endpoint2, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authorization,
          'User-Agent': 'EcoSponja API Client/1.0'
        }
      });
      
      const dados2 = response2.ok ? await response2.json() : await response2.text();
      console.log(`Método 2 - Status: ${response2.status}, Sucesso: ${response2.ok}`);
      
      resultados.push({
        metodo: 'Busca por filtro de número (Dooki)',
        url: endpoint2,
        status: response2.status,
        sucesso: response2.ok,
        dados: dados2
      });
      
      if (response2.ok) {
        sucessoGeral = true;
      }
    } catch (error) {
      console.error(`Método 2 - Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      resultados.push({
        metodo: 'Busca por filtro de número (Dooki)',
        url: endpoint2,
        erro: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
    
    // Método 3: API alternativa Yampi
    const endpoint3 = `https://api.yampi.com.br/v1/orders?filter[eq:number]=${pedidoId}`;
    try {
      console.log(`Método 3 - Testando: ${endpoint3}`);
      const response3 = await fetch(endpoint3, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authorization,
          'User-Agent': 'EcoSponja API Client/1.0'
        }
      });
      
      const dados3 = response3.ok ? await response3.json() : await response3.text();
      console.log(`Método 3 - Status: ${response3.status}, Sucesso: ${response3.ok}`);
      
      resultados.push({
        metodo: 'API alternativa Yampi',
        url: endpoint3,
        status: response3.status,
        sucesso: response3.ok,
        dados: dados3
      });
      
      if (response3.ok) {
        sucessoGeral = true;
      }
    } catch (error) {
      console.error(`Método 3 - Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      resultados.push({
        metodo: 'API alternativa Yampi',
        url: endpoint3,
        erro: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
    
    return NextResponse.json({
      pedido_id: pedidoId,
      sucesso: sucessoGeral,
      message: sucessoGeral 
        ? 'Pedido encontrado em pelo menos um dos métodos' 
        : 'Pedido não encontrado em nenhum método',
      config: {
        auth: 'Bearer *****',
        alias,
        token_preview: token.substring(0, 5) + '...'
      },
      resultados
    });
  } catch (error) {
    console.error('Erro no teste de busca de pedido:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Erro interno ao testar busca de pedido',
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
} 