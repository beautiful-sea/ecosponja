'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './styles.module.css';

interface DashboardData {
  vendas: {
    total: number;
    valorTotal: number;
    crescimento: number;
    crescimentoValor: number;
    mesAtual: number;
    mesAnterior: number;
    valorMesAtual: number;
    valorMesAnterior: number;
    ticketMedio: number;
    ticketMedioMesAtual: number;
    ticketMedioMesAnterior: number;
  };
  clientes: {
    total: number;
    crescimento: number;
    mesAtual: number;
    mesAnterior: number;
    mediaCompras: number;
  };
  statusPedidos: Record<string, number>;
  periodos: {
    mesAtual: string;
    mesAnterior: string;
  };
}

interface VendaRecente {
  id: string;
  numeroPedido: string;
  cliente: string;
  valor: number;
  status: string;
  data: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [vendasRecentes, setVendasRecentes] = useState<VendaRecente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        console.log('Iniciando carregamento dos dados do dashboard...');
        
        // Obtém o token do cookie
        const token = document.cookie
          .split('; ')
          .find(row => row.startsWith('token='))
          ?.split('=')[1];

        if (!token) {
          router.push('/admin/login');
          return;
        }

        // Configuração para requisições autenticadas
        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };
        
        // Buscar dados do dashboard da nova API
        const dashboardResponse = await fetch('/api/admin/dashboard', { headers });
        if (!dashboardResponse.ok) {
          throw new Error(`Erro ao buscar dados do dashboard: ${dashboardResponse.status} - ${dashboardResponse.statusText}`);
        }
        
        const dashboardData = await dashboardResponse.json();
        console.log('Dados do dashboard carregados com sucesso:', { 
          totalVendas: dashboardData.vendas.total,
          totalClientes: dashboardData.clientes.total,
          statusPedidos: Object.keys(dashboardData.statusPedidos).length
        });
        
        setDashboardData(dashboardData);
        
        // Buscar vendas recentes para exibição na lista
        const vendasResponse = await fetch('/api/admin/vendas', { headers });
        if (!vendasResponse.ok) {
          throw new Error(`Erro ao buscar vendas: ${vendasResponse.status} - ${vendasResponse.statusText}`);
        }
        
        const vendasData = await vendasResponse.json();
        console.log(`Carregadas ${vendasData.length} vendas`);
        
        // Preparar vendas recentes
        const vendasRecentes = vendasData
          .slice(0, 5)
          .map((venda: any) => ({
            id: venda.id,
            numeroPedido: venda.numeroPedido,
            cliente: venda.cliente.nome,
            valor: venda.valorTotal,
            status: venda.statusPedido,
            data: venda.dataPedido
          }));
        
        // Ordenar por data (mais recentes primeiro)
        vendasRecentes.sort((a: VendaRecente, b: VendaRecente) => 
          new Date(b.data).getTime() - new Date(a.data).getTime()
        );
        
        setVendasRecentes(vendasRecentes);
        console.log('Dashboard carregado com sucesso');
      } catch (err: any) {
        console.error('Erro ao carregar dados do dashboard:', err);
        setError(`Não foi possível carregar os dados do dashboard: ${err.message}`);
        
        // Se houver erro com a API de dashboard mas a API de vendas estiver funcionando,
        // tenta carregar as vendas pelo menos
        if (!vendasRecentes.length) {
          try {
            // Obtém o token novamente para garantir
            const token = document.cookie
              .split('; ')
              .find(row => row.startsWith('token='))
              ?.split('=')[1];

            if (!token) return;
            
            const headers = {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            };
            
            const vendasResponse = await fetch('/api/admin/vendas', { headers });
            if (vendasResponse.ok) {
              const vendasData = await vendasResponse.json();
              
              const vendasRecentes = vendasData
                .slice(0, 5)
                .map((venda: any) => ({
                  id: venda.id,
                  numeroPedido: venda.numeroPedido,
                  cliente: venda.cliente.nome,
                  valor: venda.valorTotal,
                  status: venda.statusPedido,
                  data: venda.dataPedido
                }))
                .sort((a: VendaRecente, b: VendaRecente) => 
                  new Date(b.data).getTime() - new Date(a.data).getTime()
                );
                
              setVendasRecentes(vendasRecentes);
              console.log('Vendas recentes carregadas com sucesso como fallback');
            }
          } catch (vendasErr) {
            console.error('Erro ao carregar vendas como fallback:', vendasErr);
          }
        }
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();

    // Recarregar a cada 5 minutos
    const intervalId = setInterval(() => {
      console.log('Recarregando dados do dashboard automaticamente...');
      fetchDashboardData();
    }, 5 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [router]);

  const formatarValor = (valor: number) => {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
  };

  const getNomeMesAtual = () => {
    const meses = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return meses[new Date().getMonth()];
  };

  const getNomeMesAnterior = () => {
    const meses = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    const mesAnteriorIndex = new Date().getMonth() - 1;
    return meses[mesAnteriorIndex >= 0 ? mesAnteriorIndex : 11];
  };

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      'paid': 'Pago',
      'pending': 'Pendente',
      'shipping': 'Enviado',
      'delivered': 'Entregue',
      'canceled': 'Cancelado'
    };
    return statusMap[status] || status;
  };

  const getStatusClass = (status: string) => {
    const statusMap: Record<string, string> = {
      'paid': styles.statusPaid,
      'pending': styles.statusPending,
      'shipping': styles.statusShipping,
      'delivered': styles.statusDelivered,
      'canceled': styles.statusCanceled
    };
    return `${styles.statusBadge} ${statusMap[status] || ''}`;
  };

  // Função para tentar recarregar dados
  const recarregarDados = () => {
    setLoading(true);
    setError(null);
    
    // Chamar novamente o useEffect
    fetchDashboardData();
  };

  // Função para buscar dados
  async function fetchDashboardData() {
    try {
      setLoading(true);
      console.log('Iniciando carregamento dos dados do dashboard...');
      
      // Obtém o token do cookie
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];

      if (!token) {
        router.push('/admin/login');
        return;
      }

      // Configuração para requisições autenticadas
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
      
      // Buscar dados do dashboard da nova API
      const dashboardResponse = await fetch('/api/admin/dashboard', { headers });
      if (!dashboardResponse.ok) {
        throw new Error(`Erro ao buscar dados do dashboard: ${dashboardResponse.status} - ${dashboardResponse.statusText}`);
      }
      
      const dashboardData = await dashboardResponse.json();
      console.log('Dados do dashboard carregados com sucesso');
      setDashboardData(dashboardData);
      
      // Buscar vendas recentes para exibição na lista
      const vendasResponse = await fetch('/api/admin/vendas', { headers });
      if (!vendasResponse.ok) {
        throw new Error(`Erro ao buscar vendas: ${vendasResponse.status} - ${vendasResponse.statusText}`);
      }
      
      const vendasData = await vendasResponse.json();
      
      // Preparar vendas recentes
      const vendasRecentes = vendasData
        .slice(0, 5)
        .map((venda: any) => ({
          id: venda.id,
          numeroPedido: venda.numeroPedido,
          cliente: venda.cliente.nome,
          valor: venda.valorTotal,
          status: venda.statusPedido,
          data: venda.dataPedido
        }));
      
      // Ordenar por data (mais recentes primeiro)
      vendasRecentes.sort((a: VendaRecente, b: VendaRecente) => 
        new Date(b.data).getTime() - new Date(a.data).getTime()
      );
      
      setVendasRecentes(vendasRecentes);
    } catch (err: any) {
      console.error('Erro ao carregar dados do dashboard:', err);
      setError(`Não foi possível carregar os dados do dashboard: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.dashboardContainer}>
      <h1 className={styles.pageTitle}>Dashboard</h1>
      
      {error && (
        <div className={styles.errorMessage}>
          {error}
          <button 
            onClick={recarregarDados} 
            className={styles.reloadButton}
          >
            Tentar novamente
          </button>
        </div>
      )}
      
      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Carregando dados...</p>
        </div>
      ) : dashboardData ? (
        <>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <h3>Total de Vendas</h3>
              <p className={styles.statValue}>{formatarValor(dashboardData.vendas.valorTotal)}</p>
              <p className={`${styles.statChange} ${dashboardData.vendas.crescimentoValor >= 0 ? styles.positive : styles.negative}`}>
                {dashboardData.vendas.crescimentoValor >= 0 ? '+' : ''}{dashboardData.vendas.crescimentoValor}% desde {getNomeMesAnterior()}
              </p>
              <div className={styles.statDetails}>
                <span>{getNomeMesAtual()}: {formatarValor(dashboardData.vendas.valorMesAtual)}</span>
                <span>{getNomeMesAnterior()}: {formatarValor(dashboardData.vendas.valorMesAnterior)}</span>
              </div>
            </div>
            
            <div className={styles.statCard}>
              <h3>Ticket Médio</h3>
              <p className={styles.statValue}>{formatarValor(dashboardData.vendas.ticketMedio)}</p>
              {dashboardData.vendas.ticketMedioMesAnterior > 0 && (
                <p className={`${styles.statChange} ${dashboardData.vendas.ticketMedioMesAtual >= dashboardData.vendas.ticketMedioMesAnterior ? styles.positive : styles.negative}`}>
                  {((dashboardData.vendas.ticketMedioMesAtual - dashboardData.vendas.ticketMedioMesAnterior) / dashboardData.vendas.ticketMedioMesAnterior * 100).toFixed(1)}% desde {getNomeMesAnterior()}
                </p>
              )}
              <div className={styles.statDetails}>
                <span>{getNomeMesAtual()}: {formatarValor(dashboardData.vendas.ticketMedioMesAtual)}</span>
                <span>{getNomeMesAnterior()}: {formatarValor(dashboardData.vendas.ticketMedioMesAnterior)}</span>
                <span>Total de pedidos: {dashboardData.vendas.total}</span>
              </div>
            </div>
            
            <div className={styles.statCard}>
              <h3>Clientes</h3>
              <p className={styles.statValue}>{dashboardData.clientes.total}</p>
              <p className={`${styles.statChange} ${dashboardData.clientes.crescimento >= 0 ? styles.positive : styles.negative}`}>
                {dashboardData.clientes.crescimento >= 0 ? '+' : ''}{dashboardData.clientes.crescimento}% desde {getNomeMesAnterior()}
              </p>
              <div className={styles.statDetails}>
                <span>{getNomeMesAtual()}: {dashboardData.clientes.mesAtual} novos clientes</span>
                <span>{getNomeMesAnterior()}: {dashboardData.clientes.mesAnterior} novos clientes</span>
                <span>Média: {dashboardData.clientes.mediaCompras.toFixed(1)} pedidos por cliente</span>
              </div>
            </div>
            
            <div className={styles.statCard}>
              <h3>Status dos Pedidos</h3>
              <div className={styles.statusSummary}>
                {Object.entries(dashboardData.statusPedidos)
                  .sort((a, b) => b[1] - a[1]) // Ordenar por quantidade (decrescente)
                  .map(([status, count]) => (
                    <div key={status} className={styles.statusItem}>
                      <span className={getStatusClass(status)}>
                        {getStatusLabel(status)}
                      </span>
                      <span className={styles.statusCount}>{count}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          <div className={styles.activitySection}>
            <div className={styles.sectionHeader}>
              <h2>Vendas Recentes</h2>
              <Link href="/admin/vendas" className={styles.sectionLink}>Ver todas</Link>
            </div>
            {vendasRecentes.length === 0 ? (
              <div className={styles.emptyState}>
                <p>Nenhuma venda recente encontrada.</p>
              </div>
            ) : (
              <div className={styles.activityList}>
                {vendasRecentes.map(venda => (
                  <div key={venda.id} className={styles.activityItem}>
                    <div className={styles.activityHeader}>
                      <span className={styles.activityDate}>{formatarData(venda.data)}</span>
                      <span className={getStatusClass(venda.status)}>
                        {getStatusLabel(venda.status)}
                      </span>
                    </div>
                    <div className={styles.activityDesc}>
                      Pedido <Link href={`/admin/vendas/${venda.id}`} className={styles.linkText}>#{venda.numeroPedido}</Link> de <strong>{venda.cliente}</strong>
                    </div>
                    <div className={styles.activityValue}>
                      {formatarValor(venda.valor)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <div className={styles.emptyState}>
          <p>Não foi possível carregar os dados do dashboard.</p>
          <button 
            onClick={recarregarDados}
            className={styles.primaryButton}
          >
            Tentar novamente
          </button>
        </div>
      )}
    </div>
  );
} 