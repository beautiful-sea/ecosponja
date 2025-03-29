import { prisma } from '@/lib/prisma';

/**
 * Registra um log de webhook no banco de dados
 * 
 * @param eventType O tipo de evento do webhook
 * @param requestBody O corpo da requisição recebida (será serializado como JSON)
 * @param responseCode O código de status da resposta
 * @param responseBody O corpo da resposta (em formato de texto)
 * @param errorMessage Mensagem de erro, se houver
 */
export async function logWebhook(
  eventType: string,
  requestBody: any,
  responseCode: number,
  responseBody?: string,
  errorMessage?: string
) {
  try {
    // Log detalhado no console primeiro (garantindo que pelo menos isso será registrado)
    console.log(`[WebhookLog] ${eventType} - Código ${responseCode}`);
    if (errorMessage) {
      console.error(`[WebhookLog] Erro: ${errorMessage}`);
    }
    
    // Tenta salvar no banco de dados
    try {
      // Verifica se a tabela existe, se não, tenta criá-la
      await ensureLogTableExists();
      
      // Insere o log
      await prisma.$executeRaw`
        INSERT INTO webhook_logs (
          event_type, 
          request_body, 
          response_code, 
          response_body, 
          error_message
        ) VALUES (
          ${eventType}, 
          ${JSON.stringify(requestBody)}::jsonb, 
          ${responseCode}, 
          ${responseBody || null}, 
          ${errorMessage || null}
        )
      `;
      
      console.log(`[WebhookLog] Log salvo no banco de dados`);
    } catch (dbError) {
      console.error('Erro ao registrar log no banco:', dbError);
      
      // Fallback: Salva log em memória (apenas para desenvolvimento)
      if (typeof global.webhookLogs === 'undefined') {
        global.webhookLogs = [];
      }
      
      global.webhookLogs.push({
        event_type: eventType,
        request_body: requestBody,
        response_code: responseCode,
        response_body: responseBody,
        error_message: errorMessage,
        created_at: new Date()
      });
      
      console.log(`[WebhookLog] Log salvo em memória (fallback)`);
    }
  } catch (error) {
    // Em caso de erro no log, apenas exibe no console mas não falha a operação
    console.error('Erro ao registrar log de webhook:', error);
  }
}

/**
 * Verifica se a tabela de logs existe e a cria se necessário
 */
async function ensureLogTableExists() {
  try {
    // Verifica se a tabela existe
    const result = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT FROM pg_tables
        WHERE schemaname = 'public'
        AND tablename = 'webhook_logs'
      ) as exists
    `;
    
    const tableExists = Array.isArray(result) && result.length > 0 && (result[0] as any).exists;
    
    // Se a tabela não existir, cria
    if (!tableExists) {
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS webhook_logs (
          id SERIAL PRIMARY KEY,
          event_type VARCHAR(255) NOT NULL,
          request_body JSONB,
          response_code INTEGER,
          response_body TEXT,
          error_message TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
        
        CREATE INDEX IF NOT EXISTS idx_webhook_logs_event_type ON webhook_logs (event_type);
        CREATE INDEX IF NOT EXISTS idx_webhook_logs_created_at ON webhook_logs (created_at);
      `;
      console.log('Tabela webhook_logs criada com sucesso');
    }
  } catch (error) {
    console.error('Erro ao verificar/criar tabela de logs:', error);
  }
}

/**
 * Verifica a assinatura do webhook da Yampi conforme a documentação oficial
 * https://docs.yampi.com.br/referencia-da-api/webhooks
 * 
 * @param signature A assinatura recebida no cabeçalho X-Yampi-Hmac-SHA256
 * @param body O corpo da requisição
 * @param webhookSecret O segredo do webhook da Yampi
 * @returns true se a assinatura for válida
 */
export function validateYampiSignature(
  signature: string,
  timestamp: string,
  body: any,
  webhookSecret: string
): boolean {
  try {
    const crypto = require('crypto');
    
    // Conforme a documentação da Yampi, a assinatura é calculada com base no corpo em JSON
    const payload = JSON.stringify(body);
    
    // Usa o HMAC-SHA256 com o segredo do webhook e retorna em base64
    const hmac = crypto.createHmac('sha256', webhookSecret);
    hmac.update(payload);
    const calculatedSignature = hmac.digest('base64');
    
    console.log('Base64 Signature:', calculatedSignature);
    console.log('Received Signature:', signature);
    
    return calculatedSignature === signature;
  } catch (error) {
    console.error('Erro ao validar assinatura:', error);
    return false;
  }
}

// Ampliando o escopo global para armazenar logs em memória quando o banco falhar
declare global {
  var webhookLogs: any[];
} 