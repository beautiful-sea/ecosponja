import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuthToken } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    // Verificar autorização
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token de autenticação necessário' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const userData = await verifyAuthToken(token);
    
    if (!userData) {
      return NextResponse.json(
        { error: 'Token de autenticação inválido' },
        { status: 401 }
      );
    }

    // Calcular estatísticas gerais
    const [
      totalVendas,
      totalClientes,
      vendasAgrupadas,
      clientesAgrupados
    ] = await Promise.all([
      prisma.venda.findMany(),
      prisma.cliente.findMany(),
      prisma.venda.groupBy({
        by: ['status'],
        _count: true,
        _sum: {
          valor_total: true
        }
      }),
      prisma.cliente.groupBy({
        by: ['created_at'],
        _count: true,
      })
    ]);

    // Calcular datas para comparação mensal
    const hoje = new Date();
    const primeiroDiaMesAtual = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    const primeiroDiaMesAnterior = new Date(hoje.getFullYear(), hoje.getMonth() - 1, 1);
    const ultimoDiaMesAnterior = new Date(hoje.getFullYear(), hoje.getMonth(), 0);

    // Vendas do mês atual e anterior
    const vendasMesAtual = totalVendas.filter(venda => {
      const dataVenda = new Date(venda.data_criacao);
      return dataVenda >= primeiroDiaMesAtual;
    });

    const vendasMesAnterior = totalVendas.filter(venda => {
      const dataVenda = new Date(venda.data_criacao);
      return dataVenda >= primeiroDiaMesAnterior && dataVenda <= ultimoDiaMesAnterior;
    });

    // Clientes do mês atual e anterior
    const clientesMesAtual = totalClientes.filter(cliente => {
      const dataCliente = new Date(cliente.created_at);
      return dataCliente >= primeiroDiaMesAtual;
    });

    const clientesMesAnterior = totalClientes.filter(cliente => {
      const dataCliente = new Date(cliente.created_at);
      return dataCliente >= primeiroDiaMesAnterior && dataCliente <= ultimoDiaMesAnterior;
    });

    // Calcular crescimento
    const crescimentoVendas = vendasMesAnterior.length > 0
      ? ((vendasMesAtual.length - vendasMesAnterior.length) / vendasMesAnterior.length) * 100
      : vendasMesAtual.length > 0 ? 100 : 0;

    const crescimentoClientes = clientesMesAnterior.length > 0
      ? ((clientesMesAtual.length - clientesMesAnterior.length) / clientesMesAnterior.length) * 100
      : clientesMesAtual.length > 0 ? 100 : 0;

    // Calcular valor total das vendas por período
    const valorTotalMesAtual = vendasMesAtual.reduce((acc, venda) => acc + venda.valor_total, 0);
    const valorTotalMesAnterior = vendasMesAnterior.reduce((acc, venda) => acc + venda.valor_total, 0);

    const crescimentoValor = valorTotalMesAnterior > 0
      ? ((valorTotalMesAtual - valorTotalMesAnterior) / valorTotalMesAnterior) * 100
      : valorTotalMesAtual > 0 ? 100 : 0;

    // Calcular valor total geral
    const valorTotal = totalVendas.reduce((acc, venda) => acc + venda.valor_total, 0);

    // Status dos pedidos
    const statusCount = vendasAgrupadas.reduce((acc, item) => {
      acc[item.status] = item._count;
      return acc;
    }, {} as Record<string, number>);

    // Preparar dados para o dashboard
    const dashboardData = {
      vendas: {
        total: totalVendas.length,
        valorTotal,
        crescimento: Number(crescimentoVendas.toFixed(1)),
        crescimentoValor: Number(crescimentoValor.toFixed(1)),
        mesAtual: vendasMesAtual.length,
        mesAnterior: vendasMesAnterior.length,
        valorMesAtual: valorTotalMesAtual,
        valorMesAnterior: valorTotalMesAnterior,
        ticketMedio: totalVendas.length > 0 ? valorTotal / totalVendas.length : 0,
        ticketMedioMesAtual: vendasMesAtual.length > 0 ? valorTotalMesAtual / vendasMesAtual.length : 0,
        ticketMedioMesAnterior: vendasMesAnterior.length > 0 ? valorTotalMesAnterior / vendasMesAnterior.length : 0,
      },
      clientes: {
        total: totalClientes.length,
        crescimento: Number(crescimentoClientes.toFixed(1)),
        mesAtual: clientesMesAtual.length,
        mesAnterior: clientesMesAnterior.length,
        mediaCompras: totalVendas.length / totalClientes.length || 0,
      },
      statusPedidos: statusCount,
      periodos: {
        mesAtual: primeiroDiaMesAtual.toISOString(),
        mesAnterior: primeiroDiaMesAnterior.toISOString(),
      }
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error('Erro ao buscar dados do dashboard:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar dados do dashboard' },
      { status: 500 }
    );
  }
} 