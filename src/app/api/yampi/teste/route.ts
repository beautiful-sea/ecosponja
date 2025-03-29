import { NextResponse } from 'next/server';
import { getYampiToken, yampiApiClient } from '@/utils/yampi';

export async function GET(request: Request) {
  try {
    console.log('Iniciando teste de conexão com a API da Yampi');
    
    // Obter o token de autenticação
    let token;
    try {
      token = await getYampiToken();
      console.log('Token Yampi obtido com sucesso');
    } catch (error) {
      console.error('Erro ao obter token:', error);
      return NextResponse.json({
        success: false,
        message: 'Falha ao obter token da Yampi',
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        config: {
          apiToken: process.env.YAMPI_API_TOKEN ? `${process.env.YAMPI_API_TOKEN.substring(0, 5)}...` : 'não configurado',
          secretKey: process.env.YAMPI_SECRET_KEY ? `${process.env.YAMPI_SECRET_KEY.substring(0, 5)}...` : 'não configurado',
          alias: process.env.YAMPI_ALIAS || 'não configurado'
        }
      }, { status: 401 });
    }
    
    // Se chegou aqui, o token foi obtido, agora vamos testar uma consulta real
    try {
      // Teste de consulta básica de pedidos
      const testResult = await yampiApiClient.getOrders({ limit: 1 });
      
      // Se chegou aqui, a consulta foi bem-sucedida
      return NextResponse.json({
        success: true,
        message: 'Conexão com a API da Yampi estabelecida com sucesso',
        token_info: {
          preview: token ? `${token.substring(0, 10)}...` : 'N/A'
        },
        config: {
          alias: process.env.YAMPI_ALIAS
        },
        result: {
          total: testResult.meta?.total || 0,
          pedidos: testResult.data && Array.isArray(testResult.data) 
            ? testResult.data.map((p: any) => ({ id: p.id, number: p.number }))
            : []
        }
      });
    } catch (error) {
      console.error('Erro na consulta de teste:', error);
      
      // Informações detalhadas de erro para depuração
      let errorDetails = {};
      if (error instanceof Error) {
        errorDetails = {
          message: error.message,
          stack: error.stack
        };
      } else {
        errorDetails = { error };
      }
      
      return NextResponse.json({
        success: false,
        message: 'Token obtido, mas falha na consulta de teste',
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        error_details: errorDetails,
        config: {
          alias: process.env.YAMPI_ALIAS
        }
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Erro no teste de conexão com a Yampi:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Erro interno ao testar conexão',
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      config: {
        apiToken: process.env.YAMPI_API_TOKEN ? `${process.env.YAMPI_API_TOKEN.substring(0, 5)}...` : 'não configurado',
        secretKey: process.env.YAMPI_SECRET_KEY ? `${process.env.YAMPI_SECRET_KEY.substring(0, 5)}...` : 'não configurado',
        alias: process.env.YAMPI_ALIAS || 'não configurado'
      }
    }, { status: 500 });
  }
} 