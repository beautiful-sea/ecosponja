import { NextResponse } from 'next/server';

/**
 * Endpoint para testes de webhook da Yampi
 * Retorna informações detalhadas sobre a requisição recebida
 * NÃO USAR EM PRODUÇÃO
 */
export async function POST(request: Request) {
  try {
    console.log('[WebhookTest] Requisição de teste recebida');
    
    // Obter todos os cabeçalhos
    const headers = Object.fromEntries(request.headers.entries());
    
    // Log de todos os cabeçalhos para debug
    console.log('[WebhookTest] Cabeçalhos:', JSON.stringify(headers, null, 2));
    
    // Buscar especificamente o cabeçalho de assinatura
    const yampiSignatureHeaders = [
      'x-yampi-hmac-sha256',
      'X-Yampi-Hmac-SHA256',
      'yampi-hmac-sha256',
      'Yampi-Hmac-SHA256'
    ];
    
    let foundSignature = null;
    for (const header of yampiSignatureHeaders) {
      if (headers[header]) {
        foundSignature = { header, value: headers[header] };
        break;
      }
    }
    
    // Obter o corpo da requisição como texto para preservar exatamente como foi enviado
    const requestText = await request.text();
    let requestBody;
    
    try {
      requestBody = JSON.parse(requestText);
    } catch (e) {
      requestBody = { raw: requestText };
    }
    
    // Criar resposta detalhada para fins de debug
    const response = {
      success: true,
      test: true,
      message: 'Endpoint de teste do webhook - dados recebidos com sucesso',
      signature: foundSignature || 'Não encontrada',
      received: {
        headers: headers,
        body: requestBody,
        bodyRaw: requestText.substring(0, 500) + (requestText.length > 500 ? '...' : ''),
        method: request.method,
        url: request.url
      },
      timestamp: new Date().toISOString()
    };
    
    console.log('[WebhookTest] Resposta:', JSON.stringify(response, null, 2));
    
    // Salvar nos logs globais para referência
    if (typeof global.webhookLogs === 'undefined') {
      global.webhookLogs = [];
    }
    
    global.webhookLogs.push({
      event_type: 'webhook.test',
      request_body: requestBody,
      response_code: 200,
      response_body: JSON.stringify(response),
      created_at: new Date()
    });
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('[WebhookTest] Erro:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Endpoint de teste para webhooks da Yampi',
    instructions: 'Envie uma requisição POST para este endpoint com os mesmos cabeçalhos e corpo que a Yampi envia',
    usage: 'Configure um webhook na Yampi apontando para esta URL para depurar problemas'
  });
} 