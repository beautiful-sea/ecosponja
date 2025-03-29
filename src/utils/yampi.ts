import crypto from 'crypto';
import axios from 'axios';

// Armazenamento do token atual
let apiTokenCache: {
  token: string;
  expiresAt: number;
} | null = null;

/**
 * Obtém um token para autenticação com a API da Yampi
 * A API da Yampi usa o token diretamente, sem necessidade de OAuth
 */
export async function getYampiToken(): Promise<string> {
  try {
    // Verifica se já temos um token válido em cache
    const now = Date.now();
    if (apiTokenCache && apiTokenCache.expiresAt > now) {
      console.log('Usando token Yampi em cache');
      return apiTokenCache.token;
    }

    // Credenciais obrigatórias
    const apiToken = process.env.YAMPI_API_TOKEN;
    const secretKey = process.env.YAMPI_SECRET_KEY;
    const storeAlias = process.env.YAMPI_ALIAS;
    
    if (!apiToken || !secretKey || !storeAlias) {
      throw new Error('Credenciais da Yampi não configuradas. Verifique YAMPI_API_TOKEN, YAMPI_SECRET_KEY e YAMPI_ALIAS no .env');
    }
    
    console.log(`Configurando token Yampi para loja: ${storeAlias}`);
    
    // A documentação da Yampi indica que podemos usar o token diretamente
    const token = apiToken;
    
    // Armazena em cache com expiração em 1 hora
    apiTokenCache = {
      token,
      expiresAt: now + 3600000 // 1 hora
    };
    
    console.log('Token Yampi configurado com sucesso');
    
    return token;
  } catch (error) {
    console.error('Erro ao configurar token Yampi:', error);
    throw new Error('Falha na configuração do token da API Yampi');
  }
}

/**
 * Cliente da API Yampi com configuração centralizada e gerenciamento de erros
 */
export const yampiApiClient = {
  /**
   * Executa uma requisição à API da Yampi com autenticação
   * @param method Método HTTP
   * @param endpoint Endpoint da API
   * @param data Dados para enviar (opcional)
   * @returns Resposta da API
   */
  async request(method: 'GET' | 'POST' | 'PUT' | 'DELETE', endpoint: string, data?: any): Promise<any> {
    try {
      // Obtém o token de autenticação
      const token = await getYampiToken();
      const storeAlias = process.env.YAMPI_ALIAS;
      
      if (!storeAlias) {
        throw new Error('Alias da loja Yampi não configurado');
      }
      
      // Configura a URL completa se necessário
      let url = endpoint;
      if (!url.startsWith('http')) {
        url = `https://api.dooki.com.br/v2/${storeAlias}/${endpoint.replace(/^\//, '')}`;
      }
      
      console.log(`Requisição ${method} para ${url}`);
      
      // Executa a requisição com Bearer token conforme documentação
      const response = await axios({
        method,
        url,
        data: method !== 'GET' ? data : undefined,
        params: method === 'GET' && data ? data : undefined,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          'User-Agent': 'EcoSponja API Client/1.0'
        }
      });
      
      // Retorna os dados da resposta
      return response.data;
    } catch (error) {
      console.error(`Erro na requisição à API Yampi:`, error);
      
      // Para erros de requisição do axios
      if (axios.isAxiosError(error) && error.response) {
        console.error('Detalhes da resposta de erro:', {
          status: error.response.status,
          data: error.response.data
        });
        
        // Se o erro for de autenticação, limpa o token para forçar nova autenticação na próxima tentativa
        if (error.response.status === 401) {
          apiTokenCache = null;
        }
        
        throw new Error(`Erro na API Yampi (${error.response.status}): ${JSON.stringify(error.response.data)}`);
      }
      
      throw error;
    }
  },
  
  /**
   * Busca pedidos na API da Yampi
   * @param params Parâmetros de busca
   * @returns Lista de pedidos
   */
  async getOrders(params: any = {}): Promise<any> {
    try {
      // Primeiro tenta a API principal
      return await this.request('GET', 'orders', params);
    } catch (error) {
      console.error('Erro na API principal, tentando API alternativa:', error);
      
      // Se falhar, tenta a API alternativa
      const storeAlias = process.env.YAMPI_ALIAS;
      const token = await getYampiToken();
      
      if (!storeAlias) {
        throw new Error('Alias da loja Yampi não configurado');
      }
      
      // Parâmetros de consulta para a API alternativa (formato diferente)
      const queryParams: Record<string, string> = {};
      if (params.page) queryParams['page'] = params.page.toString();
      if (params.limit) queryParams['limit'] = params.limit.toString();
      
      // Endpoint alternativo 
      const url = `https://api.yampi.com.br/v1/orders`;
      
      console.log(`Tentando API alternativa: ${url}`);
      
      const response = await axios({
        method: 'GET',
        url,
        params: queryParams,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          'User-Agent': 'EcoSponja API Client/1.0'
        }
      });
      
      return response.data;
    }
  },
  
  /**
   * Busca um pedido específico pelo ID ou número
   * @param orderId ID ou número do pedido
   * @returns Dados do pedido
   */
  async getOrder(orderId: string): Promise<any> {
    const isOrderNumber = !isNaN(Number(orderId));
    
    try {
      // Primeiro tenta a API principal
      if (isOrderNumber) {
        try {
          // Busca pelo número do pedido
          const response = await this.request('GET', 'orders', { 'q[number]': orderId });
          
          // Verifica se há resultados
          if (response.data && Array.isArray(response.data) && response.data.length > 0) {
            return { data: response.data[0] };
          }
        } catch (error) {
          console.log('Erro ao buscar pelo número do pedido na API principal, tentando por ID direto');
        }
        
        // Se não encontrou pelo número, tenta com o ID direto
        try {
          const response = await this.request('GET', `orders/${orderId}`);
          return response;
        } catch (error) {
          console.log('Erro ao buscar pelo ID direto na API principal, tentando API alternativa');
        }
      } else {
        try {
          // Busca pelo ID do pedido
          const response = await this.request('GET', `orders/${orderId}`);
          return response;
        } catch (error) {
          console.log('Erro ao buscar pelo ID na API principal, tentando API alternativa');
        }
      }
      
      // Se chegou aqui, tenta a API alternativa
      const token = await getYampiToken();
      
      // Monta os filtros para a API alternativa
      const filterParam = isOrderNumber ? `filter[eq:number]=${orderId}` : `filter[eq:id]=${orderId}`;
      const url = `https://api.yampi.com.br/v1/orders?${filterParam}`;
      
      console.log(`Tentando API alternativa para pedido ${orderId}: ${url}`);
      
      const response = await axios({
        method: 'GET',
        url,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          'User-Agent': 'EcoSponja API Client/1.0'
        }
      });
      
      if (response.data && response.data.data) {
        if (Array.isArray(response.data.data) && response.data.data.length > 0) {
          return { data: response.data.data[0] };
        } else {
          return { data: response.data.data };
        }
      }
      
      throw new Error(`Pedido ${orderId} não encontrado em nenhuma API`);
    } catch (error) {
      console.error(`Erro ao buscar pedido ${orderId}:`, error);
      throw new Error(`Não foi possível encontrar o pedido ${orderId}: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }
};

/**
 * Busca um pedido da API da Yampi
 * @param orderId ID ou número do pedido
 * @returns Dados do pedido ou null se falhar
 */
export async function fetchYampiOrder(orderId: string): Promise<any> {
  try {
    console.log(`Buscando pedido Yampi ${orderId}`);
    const orderData = await yampiApiClient.getOrder(orderId);
    return orderData;
  } catch (error) {
    console.error(`Erro ao buscar pedido ${orderId} da Yampi:`, error);
    throw error;
  }
}

/**
 * Busca uma lista de pedidos da API da Yampi
 * @param page Número da página
 * @param limit Limite de itens por página
 * @returns Lista de pedidos
 */
export async function fetchYampiOrders(page = 1, limit = 20): Promise<any> {
  try {
    console.log(`Buscando lista de pedidos Yampi (página ${page}, limite ${limit})`);
    return await yampiApiClient.getOrders({ page, limit });
  } catch (error) {
    console.error('Erro ao buscar lista de pedidos Yampi:', error);
    throw error;
  }
}

/**
 * Valida a assinatura de um webhook da Yampi conforme documentação oficial:
 * https://docs.yampi.com.br/referencia-da-api/webhooks
 * 
 * @param signature Assinatura recebida no cabeçalho X-Yampi-Hmac-SHA256
 * @param payload Corpo da requisição em formato string
 * @param secret Segredo compartilhado (opcional, usa variável de ambiente se não fornecido)
 * @returns Verdadeiro se a assinatura for válida
 */
export function validateYampiSignature(
  signature: string,
  payload: string,
  secret?: string
): boolean {
  try {
    // Se não houver assinatura, rejeita
    if (!signature) {
      console.error('Assinatura ausente');
      return false;
    }

    // Obtém o segredo do webhook da variável de ambiente ou do parâmetro
    const webhookSecret = secret || process.env.YAMPI_WEBHOOK_SECRET || '';
    
    if (!webhookSecret) {
      console.error('Segredo do webhook não configurado');
      return false;
    }

    // Cria o HMAC usando SHA-256 e gera o hash em base64 conforme documentação
    const hmac = crypto.createHmac('sha256', webhookSecret);
    hmac.update(payload);
    const expectedSignature = hmac.digest('base64');
    
    // Log para depuração
    console.log('Validação Yampi:');
    console.log(`- Payload recebido (${payload.length} caracteres)`);
    console.log(`- Segredo do webhook: '${webhookSecret.substring(0, 5)}...'`);
    console.log(`- Assinatura recebida: '${signature}'`);
    console.log(`- Assinatura calculada: '${expectedSignature}'`);
    
    // Compara as assinaturas (exatamente como documentado pela Yampi)
    return signature === expectedSignature;
  } catch (error) {
    console.error('Erro ao validar assinatura:', error);
    return false;
  }
}

/**
 * Extrair informações de cliente de um pedido da Yampi
 */
export function extractCustomerInfo(orderData: any) {
  if (!orderData) {
    return null;
  }

  // Na API da Yampi, o cliente pode estar em customer ou em customer_id e seus dados
  const customer = orderData.customer || {};
  
  return {
    nome: customer.first_name && customer.last_name 
      ? `${customer.first_name || ''} ${customer.last_name || ''}`.trim()
      : customer.name || 'Cliente sem nome',
    email: customer.email || orderData.customer_email || '',
    telefone: customer.phone ? formatPhone(customer.phone) : '',
    documento: formatDocument(customer.document || '')
  };
}

/**
 * Extrair informações de endereço de um pedido da Yampi
 */
export function extractAddressInfo(orderData: any) {
  if (!orderData || !orderData.shipping_address) {
    return null;
  }

  const address = orderData.shipping_address;
  
  return {
    cep: formatZipCode(address.zipcode),
    rua: address.street || '',
    numero: address.number || '',
    complemento: address.complement || '',
    bairro: address.neighborhood || '',
    cidade: address.city || '',
    estado: address.state || '',
    pais: address.country || 'Brasil'
  };
}

/**
 * Formata um número de telefone
 */
function formatPhone(phone: string) {
  if (!phone) return '';
  
  // Remove caracteres não numéricos
  const numbers = phone.replace(/\D/g, '');
  
  // Formato básico
  return numbers;
}

/**
 * Formata um documento (CPF/CNPJ)
 */
function formatDocument(document: string) {
  if (!document) return '';
  
  // Remove caracteres não numéricos
  const numbers = document.replace(/\D/g, '');
  
  // Formato básico
  return numbers;
}

/**
 * Formatar CEP
 */
function formatZipCode(zipcode: string): string {
  if (!zipcode) return '';
  
  // Remove tudo que não for número
  const numbers = zipcode.replace(/\D/g, '');
  
  // Formata CEP: 00000-000
  if (numbers.length === 8) {
    return `${numbers.substring(0, 5)}-${numbers.substring(5)}`;
  }
  
  // Retorna como está se não reconhecer o padrão
  return zipcode;
} 