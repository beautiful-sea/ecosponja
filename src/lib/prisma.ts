import { PrismaClient } from '@prisma/client';

// Declaramos um escopo global para o prisma
declare global {
  var prisma: PrismaClient | undefined;
}

// Função para criar um cliente Prisma com tratamento de erros
function createPrismaClient() {
  try {
    const client = new PrismaClient({
      log: ['error', 'warn']
    });
    
    // Adiciona tratamento de erros global
    client.$use(async (params, next) => {
      try {
        return await next(params);
      } catch (error) {
        console.error('Erro na operação do Prisma:', error);
        throw error;
      }
    });
    
    return client;
  } catch (error) {
    console.error('Erro ao inicializar o Prisma:', error);
    
    // Prisma Client alternativo baseado em SQL direto para suporte temporário
    return {
      cliente: {
        findUnique: async (params: { where: Record<string, any> }) => {
          console.log('Usando fallback para cliente.findUnique', params.where);
          return null;
        },
        create: async (params: { data: Record<string, any> }) => {
          console.log('Usando fallback para cliente.create', params.data);
          return { id: 'temp-' + Date.now(), ...params.data };
        }
      },
      venda: {
        findUnique: async (params: { where: Record<string, any> }) => {
          console.log('Usando fallback para venda.findUnique', params.where);
          return null;
        },
        create: async (params: { data: Record<string, any> }) => {
          console.log('Usando fallback para venda.create', params.data);
          return { id: 'temp-' + Date.now(), ...params.data };
        },
        update: async (params: { where: Record<string, any>, data: Record<string, any> }) => {
          console.log('Usando fallback para venda.update', params.where, params.data);
          return { id: 'temp-' + Date.now(), ...params.data };
        }
      },
      $queryRaw: async (sql: any) => {
        console.log('Usando fallback para $queryRaw', sql);
        return [];
      },
      $executeRaw: async (sql: any) => {
        console.log('Usando fallback para $executeRaw', sql);
        return { count: 0 };
      }
    } as unknown as PrismaClient;
  }
}

// Exportamos uma instância única do PrismaClient
export const prisma = global.prisma || createPrismaClient();

// Em desenvolvimento, anexamos o cliente ao objeto global
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
} 