import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Limpa o banco de dados
  await prisma.venda.deleteMany({});
  await prisma.cliente.deleteMany({});
  await prisma.user.deleteMany({});

  // Cria um usuário admin padrão
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.create({
    data: {
      username: 'admin',
      password: hashedPassword,
      name: 'Administrador',
      email: 'admin@ecosponja.com.br',
    },
  });

  // Cria clientes
  const cliente1 = await prisma.cliente.create({
    data: {
      nome: 'João Silva',
      email: 'joao.silva@exemplo.com',
    },
  });

  const cliente2 = await prisma.cliente.create({
    data: {
      nome: 'Maria Oliveira',
      email: 'maria.oliveira@exemplo.com',
    },
  });

  const cliente3 = await prisma.cliente.create({
    data: {
      nome: 'Carlos Santos',
      email: 'carlos.santos@exemplo.com',
    },
  });

  // Cria vendas
  await prisma.venda.create({
    data: {
      pedido_id: '1001',
      status: 'paid',
      valor_total: 149.90,
      cliente_id: cliente1.id,
      valor_frete: 15.00,
      metodo_pagamento: 'credit_card',
      parcelas: 2,
    },
  });

  await prisma.venda.create({
    data: {
      pedido_id: '1002',
      status: 'pending',
      valor_total: 89.90,
      cliente_id: cliente2.id,
      valor_frete: 10.00,
      metodo_pagamento: 'boleto',
    },
  });

  await prisma.venda.create({
    data: {
      pedido_id: '1003',
      status: 'shipping',
      valor_total: 199.80,
      cliente_id: cliente1.id,
      valor_frete: 0,
      valor_desconto: 20.00,
      metodo_pagamento: 'credit_card',
      parcelas: 3,
      rastreamento: 'BR123456789',
      url_rastreamento: 'https://rastreamento.correios.com.br',
    },
  });

  await prisma.venda.create({
    data: {
      pedido_id: '1004',
      status: 'delivered',
      valor_total: 59.90,
      cliente_id: cliente3.id,
      valor_frete: 12.50,
      metodo_pagamento: 'pix',
      rastreamento: 'BR987654321',
      url_rastreamento: 'https://rastreamento.correios.com.br',
    },
  });

  await prisma.venda.create({
    data: {
      pedido_id: '1005',
      status: 'canceled',
      valor_total: 129.90,
      cliente_id: cliente2.id,
      valor_frete: 15.00,
      metodo_pagamento: 'credit_card',
      parcelas: 1,
    },
  });

  console.log('Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 