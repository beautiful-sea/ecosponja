'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import styles from './styles.module.css';

type StatusType = 'paid' | 'pending' | 'shipping' | 'delivered' | 'canceled';

interface Pedido {
  id: string;
  numeroPedido: string;
  statusPedido: StatusType;
  valorTotal: number;
  dataPedido: string;
  dataAtualizacao?: string;
  valorFrete?: number;
  valorDesconto?: number;
  metodoPagamento?: string;
  parcelas?: number;
  codigoRastreio?: string;
  urlRastreio?: string;
  yampiId?: string;
  yampiStatusId?: number;
}

interface Cliente {
  id: string;
  nome: string;
  email: string;
  created_at: string;
  updated_at: string;
  pedidos: Pedido[];
}

export default function ClienteDetalhesPage() {
  const params = useParams();
  const router = useRouter();
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCliente = async () => {
      try {
        setLoading(true);
        const clienteId = params.id;
        
        const response = await fetch(`/api/admin/clientes/${clienteId}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Cliente não encontrado');
          }
          throw new Error(`Erro ao buscar cliente: ${response.status}`);
        }
        
        const data = await response.json();
        setCliente(data);
      } catch (err) {
        console.error('Erro ao buscar detalhes do cliente:', err);
        setError('Não foi possível carregar os detalhes do cliente. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchCliente();
    }
  }, [params.id]);

  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatarDataHora = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatarValor = (valor: number) => {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
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

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button 
          className={styles.backButton}
          onClick={() => router.push('/admin/clientes')}
        >
          ← Voltar
        </button>
        <h1 className={styles.pageTitle}>Detalhes do Cliente</h1>
      </div>

      {error && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}

      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Carregando detalhes do cliente...</p>
        </div>
      ) : cliente ? (
        <div className={styles.content}>
          <div className={styles.clienteCard}>
            <h2 className={styles.clienteName}>{cliente.nome}</h2>
            <div className={styles.clienteInfo}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Email:</span>
                <span className={styles.infoValue}>{cliente.email}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Cliente desde:</span>
                <span className={styles.infoValue}>{formatarData(cliente.created_at)}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Total de pedidos:</span>
                <span className={`${styles.infoValue} ${styles.pedidoCount}`}>{cliente.pedidos.length}</span>
              </div>
            </div>
          </div>

          <h2 className={styles.sectionTitle}>Pedidos</h2>
          
          {cliente.pedidos.length === 0 ? (
            <div className={styles.emptyState}>
              <p>Este cliente ainda não possui pedidos.</p>
            </div>
          ) : (
            <div className={styles.pedidosTable}>
              <table>
                <thead>
                  <tr>
                    <th>Nº Pedido</th>
                    <th>Data</th>
                    <th>Valor</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {cliente.pedidos.map(pedido => (
                    <tr key={pedido.id}>
                      <td>
                        <div className={styles.pedidoCell}>
                          {pedido.numeroPedido}
                          {pedido.yampiId && <span className={styles.yampiTag}>Yampi</span>}
                        </div>
                      </td>
                      <td>{formatarData(pedido.dataPedido)}</td>
                      <td>{formatarValor(pedido.valorTotal)}</td>
                      <td>
                        <span className={getStatusClass(pedido.statusPedido)}>
                          {getStatusLabel(pedido.statusPedido)}
                        </span>
                      </td>
                      <td>
                        <button 
                          className={styles.viewButton}
                          onClick={() => router.push(`/admin/vendas/${pedido.id}`)}
                        >
                          Ver detalhes
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <p>Cliente não encontrado ou ID inválido.</p>
          <button 
            className={styles.linkButton}
            onClick={() => router.push('/admin/clientes')}
          >
            Voltar para lista de clientes
          </button>
        </div>
      )}
    </div>
  );
} 