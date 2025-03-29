'use client';

import { useState, useEffect } from 'react';
import styles from './styles.module.css';

type StatusType = 'paid' | 'pending' | 'shipping' | 'delivered' | 'canceled';

interface Cliente {
  id: string;
  nome: string;
  email: string;
}

interface Venda {
  id: string;
  numeroPedido: string;
  statusPedido: StatusType;
  valorTotal: number;
  dataPedido: string;
  dataAtualizacao?: string;
  cliente: Cliente;
  valorFrete?: number;
  valorDesconto?: number;
  metodoPagamento?: string;
  parcelas?: number;
  codigoRastreio?: string;
  urlRastreio?: string;
  yampiId?: string;
  yampiStatusId?: number;
}

export default function VendasPage() {
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [filtroStatus, setFiltroStatus] = useState<StatusType | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sincronizando, setSincronizando] = useState(false);
  const [sincronizandoPedido, setSincronizandoPedido] = useState<string | null>(null);

  // Buscar vendas do backend
  useEffect(() => {
    async function fetchVendas() {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/vendas');
        
        if (!response.ok) {
          throw new Error(`Erro ao buscar vendas: ${response.status}`);
        }
        
        const data = await response.json();
        setVendas(data);
      } catch (err) {
        console.error('Erro ao buscar vendas:', err);
        setError('Não foi possível carregar as vendas. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    }

    fetchVendas();
  }, []);

  // Função para sincronizar todas as vendas com a Yampi
  const sincronizarVendas = async () => {
    try {
      setSincronizando(true);
      setError(null);
      
      const response = await fetch('/api/yampi/pedidos/importar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          limit: 50,
          max_pages: 1
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro ao sincronizar pedidos: ${response.status}`);
      }

      const result = await response.json();
      
      // Recarregar as vendas após sincronização
      const vendasResponse = await fetch('/api/admin/vendas');
      
      if (vendasResponse.ok) {
        const data = await vendasResponse.json();
        setVendas(data);
      }
      
      return result;
    } catch (err) {
      console.error('Erro na sincronização:', err);
      setError('Falha ao sincronizar pedidos com a Yampi. Tente novamente mais tarde.');
    } finally {
      setSincronizando(false);
    }
  };

  // Função para sincronizar um pedido específico
  const sincronizarPedido = async (pedidoId: string, yampiId?: string) => {
    try {
      setSincronizandoPedido(pedidoId);
      
      const idToSync = yampiId || pedidoId;
      const response = await fetch(`/api/yampi/pedidos/${idToSync}?force=true`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao sincronizar pedido ${pedidoId}: ${response.status}`);
      }
      
      const result = await response.json();
      
      // Recarregar as vendas após sincronização
      const vendasResponse = await fetch('/api/admin/vendas');
      
      if (vendasResponse.ok) {
        const data = await vendasResponse.json();
        setVendas(data);
      }
      
      return result;
    } catch (err) {
      console.error(`Erro ao sincronizar pedido ${pedidoId}:`, err);
      setError(`Falha ao sincronizar o pedido ${pedidoId}. Tente novamente mais tarde.`);
    } finally {
      setSincronizandoPedido(null);
    }
  };

  const getStatusLabel = (status: StatusType) => {
    const statusMap = {
      paid: 'Pago',
      pending: 'Pendente',
      shipping: 'Enviado',
      delivered: 'Entregue',
      canceled: 'Cancelado'
    };
    return statusMap[status];
  };

  const getStatusClass = (status: StatusType) => {
    const statusClassMap = {
      paid: styles.statusPaid,
      pending: styles.statusPending,
      shipping: styles.statusShipping,
      delivered: styles.statusDelivered,
      canceled: styles.statusCanceled
    };
    return `${styles.statusBadge} ${statusClassMap[status]}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const vendasFiltradas = filtroStatus === 'all'
    ? vendas
    : vendas.filter(venda => venda.statusPedido === filtroStatus);

  return (
    <div className={styles.vendasContainer}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Vendas</h1>
        <div className={styles.headerActions}>
          <button 
            className={`${styles.syncButton} ${sincronizando ? styles.loading : ''}`}
            onClick={sincronizarVendas}
            disabled={sincronizando}
          >
            {sincronizando ? 'Sincronizando...' : 'Sincronizar com Yampi'}
          </button>
          <button className={styles.newButton}>Nova Venda</button>
        </div>
      </div>

      {error && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}

      <div className={styles.filterSection}>
        <div className={styles.filterGroup}>
          <label>Status:</label>
          <select 
            value={filtroStatus} 
            onChange={(e) => setFiltroStatus(e.target.value as StatusType | 'all')}
            className={styles.filterSelect}
          >
            <option value="all">Todos</option>
            <option value="paid">Pagos</option>
            <option value="pending">Pendentes</option>
            <option value="shipping">Enviados</option>
            <option value="delivered">Entregues</option>
            <option value="canceled">Cancelados</option>
          </select>
        </div>
      </div>

      <div className={styles.tableContainer}>
        {loading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p>Carregando vendas...</p>
          </div>
        ) : vendasFiltradas.length === 0 ? (
          <div className={styles.emptyState}>
            <h3>Nenhuma venda encontrada</h3>
            <p>Tente alterar os filtros ou sincronizar com a Yampi.</p>
          </div>
        ) : (
          <table className={styles.vendasTable}>
            <thead>
              <tr>
                <th>Pedido</th>
                <th>Cliente</th>
                <th>Valor</th>
                <th>Status</th>
                <th>Data</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {vendasFiltradas.map(venda => (
                <tr key={venda.id}>
                  <td>
                    <div className={styles.pedidoCell}>
                      {venda.numeroPedido}
                      {venda.yampiId && <span className={styles.yampiTag}>Yampi</span>}
                    </div>
                  </td>
                  <td>{venda.cliente.nome}</td>
                  <td>{formatCurrency(venda.valorTotal)}</td>
                  <td>
                    <span className={getStatusClass(venda.statusPedido)}>
                      {getStatusLabel(venda.statusPedido)}
                    </span>
                  </td>
                  <td>{formatDate(venda.dataPedido)}</td>
                  <td>
                    <div className={styles.actionButtons}>
                      <button 
                        className={styles.viewButton}
                        onClick={() => window.location.href = `/admin/vendas/${venda.id}`}
                      >
                        Ver
                      </button>
                      <button 
                        className={`${styles.syncButton} ${sincronizandoPedido === venda.numeroPedido ? styles.loading : ''}`}
                        onClick={() => sincronizarPedido(venda.numeroPedido, venda.yampiId)}
                        disabled={sincronizandoPedido === venda.numeroPedido}
                        title="Sincronizar com Yampi"
                      >
                        {sincronizandoPedido === venda.numeroPedido ? '...' : '↻'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
} 