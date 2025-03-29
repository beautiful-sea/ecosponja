'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import styles from './styles.module.css';

type StatusType = 'paid' | 'pending' | 'shipping' | 'delivered' | 'canceled';

interface Cliente {
  id: string;
  nome: string;
  email: string;
}

interface Produto {
  id: string;
  nome: string;
  sku: string;
  quantidade: number;
  precoUnitario: number;
  precoTotal: number;
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
  servicoEnvio?: string;
  formaPagamento?: string;
  endereco?: any;
  itens?: any[];
  produtos: Produto[];
  gatewayPagamento?: string;
  observacoes?: string;
}

export default function VendaDetalhesPage() {
  const params = useParams();
  const router = useRouter();
  const [venda, setVenda] = useState<Venda | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sincronizando, setSincronizando] = useState(false);

  useEffect(() => {
    const fetchVenda = async () => {
      try {
        setLoading(true);
        const vendaId = params.id;
        
        const response = await fetch(`/api/admin/vendas/${vendaId}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Venda não encontrada');
          }
          throw new Error(`Erro ao buscar venda: ${response.status}`);
        }
        
        const data = await response.json();
        setVenda(data);
      } catch (err) {
        console.error('Erro ao buscar detalhes da venda:', err);
        setError('Não foi possível carregar os detalhes da venda. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchVenda();
    }
  }, [params.id]);

  const sincronizarPedido = async () => {
    if (!venda) return;
    
    try {
      setSincronizando(true);
      setError(null);
      
      const idToSync = venda.yampiId || venda.numeroPedido;
      const response = await fetch(`/api/yampi/pedidos/${idToSync}?force=true`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao sincronizar pedido: ${response.status}`);
      }
      
      // Após sincronizar, recarregar os dados da venda
      const vendaResponse = await fetch(`/api/admin/vendas/${params.id}`);
      
      if (vendaResponse.ok) {
        const data = await vendaResponse.json();
        setVenda(data);
      }
    } catch (err) {
      console.error('Erro ao sincronizar pedido:', err);
      setError('Falha ao sincronizar com a Yampi. Tente novamente mais tarde.');
    } finally {
      setSincronizando(false);
    }
  };

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

  const formatarValor = (valor: number | undefined) => {
    if (valor === undefined) return '-';
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
          onClick={() => router.push('/admin/vendas')}
        >
          ← Voltar
        </button>
        <h1 className={styles.pageTitle}>Detalhes do Pedido</h1>
      </div>

      {error && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}

      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Carregando detalhes do pedido...</p>
        </div>
      ) : venda ? (
        <div className={styles.content}>
          <div className={styles.orderHeader}>
            <div className={styles.orderInfo}>
              <div className={styles.orderNumber}>
                Pedido #{venda.numeroPedido}
                {venda.yampiId && (
                  <span className={styles.yampiTag}>Yampi</span>
                )}
              </div>
              <div className={styles.orderStatus}>
                <span className={getStatusClass(venda.statusPedido)}>
                  {getStatusLabel(venda.statusPedido)}
                </span>
              </div>
            </div>
            <div className={styles.orderActions}>
              <button 
                className={`${styles.syncButton} ${sincronizando ? styles.loading : ''}`}
                onClick={sincronizarPedido}
                disabled={sincronizando}
              >
                {sincronizando ? 'Sincronizando...' : 'Sincronizar com Yampi'}
              </button>
            </div>
          </div>

          <div className={styles.orderGrid}>
            <div className={styles.orderCard}>
              <h3>Informações do Pedido</h3>
              <div className={styles.cardContent}>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Data do pedido:</span>
                  <span className={styles.infoValue}>{formatarDataHora(venda.dataPedido)}</span>
                </div>
                {venda.dataAtualizacao && (
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Última atualização:</span>
                    <span className={styles.infoValue}>{formatarDataHora(venda.dataAtualizacao)}</span>
                  </div>
                )}
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Método de pagamento:</span>
                  <span className={styles.infoValue}>
                    {venda.metodoPagamento === 'credit_card' 
                      ? `Cartão de Crédito${venda.parcelas ? ` em ${venda.parcelas}x` : ''}` 
                      : venda.metodoPagamento === 'boleto' 
                      ? 'Boleto Bancário' 
                      : venda.metodoPagamento === 'pix' 
                      ? 'PIX' 
                      : venda.formaPagamento || 'Não informado'}
                  </span>
                </div>
                {venda.gatewayPagamento && (
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Gateway:</span>
                    <span className={styles.infoValue}>{venda.gatewayPagamento}</span>
                  </div>
                )}
                {venda.codigoRastreio && (
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Rastreamento:</span>
                    <span className={styles.infoValue}>
                      {venda.codigoRastreio}
                      {venda.urlRastreio && (
                        <a href={venda.urlRastreio} target="_blank" rel="noopener noreferrer" className={styles.trackingLink}>
                          Rastrear
                        </a>
                      )}
                    </span>
                  </div>
                )}
                {venda.servicoEnvio && (
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Serviço de envio:</span>
                    <span className={styles.infoValue}>{venda.servicoEnvio}</span>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.orderCard}>
              <h3>Informações do Cliente</h3>
              <div className={styles.cardContent}>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Nome:</span>
                  <span className={styles.infoValue}>{venda.cliente.nome}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Email:</span>
                  <span className={styles.infoValue}>{venda.cliente.email}</span>
                </div>
                <div className={styles.clienteActions}>
                  <button 
                    className={styles.viewButton}
                    onClick={() => router.push(`/admin/clientes/${venda.cliente.id}`)}
                  >
                    Ver detalhes do cliente
                  </button>
                </div>
              </div>
            </div>

            {venda.endereco && (
              <div className={styles.orderCard}>
                <h3>Endereço de Entrega</h3>
                <div className={styles.cardContent}>
                  {venda.endereco.destinatario && (
                    <div className={styles.infoRow}>
                      <span className={styles.infoLabel}>Destinatário:</span>
                      <span className={styles.infoValue}>{venda.endereco.destinatario}</span>
                    </div>
                  )}
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Endereço:</span>
                    <span className={styles.infoValue}>
                      {`${venda.endereco.rua}, ${venda.endereco.numero}`}
                      {venda.endereco.complemento && ` - ${venda.endereco.complemento}`}
                    </span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Bairro:</span>
                    <span className={styles.infoValue}>{venda.endereco.bairro}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Cidade/UF:</span>
                    <span className={styles.infoValue}>{`${venda.endereco.cidade}/${venda.endereco.estado}`}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>CEP:</span>
                    <span className={styles.infoValue}>{venda.endereco.cep}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>País:</span>
                    <span className={styles.infoValue}>{venda.endereco.pais || 'Brasil'}</span>
                  </div>
                </div>
              </div>
            )}

            <div className={styles.orderCard}>
              <h3>Resumo Financeiro</h3>
              <div className={styles.cardContent}>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Subtotal:</span>
                  <span className={styles.infoValue}>
                    {formatarValor(venda.valorTotal - (venda.valorFrete || 0) + (venda.valorDesconto || 0))}
                  </span>
                </div>
                {venda.valorDesconto && venda.valorDesconto > 0 && (
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Desconto:</span>
                    <span className={styles.infoValue}>- {formatarValor(venda.valorDesconto)}</span>
                  </div>
                )}
                {venda.valorFrete !== undefined && (
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Frete:</span>
                    <span className={styles.infoValue}>{formatarValor(venda.valorFrete)}</span>
                  </div>
                )}
                <div className={`${styles.infoRow} ${styles.totalRow}`}>
                  <span className={styles.infoLabel}>Total:</span>
                  <span className={`${styles.infoValue} ${styles.totalValue}`}>
                    {formatarValor(venda.valorTotal)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.productsSection}>
            <h3>Produtos</h3>
            {venda.produtos.length === 0 ? (
              <div className={styles.emptyState}>
                <p>Não há informações de produtos para este pedido.</p>
              </div>
            ) : (
              <div className={styles.productsTable}>
                <table>
                  <thead>
                    <tr>
                      <th>Produto</th>
                      <th>SKU</th>
                      <th>Preço</th>
                      <th>Qtd</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {venda.produtos.map((produto, index) => (
                      <tr key={`${produto.id}-${index}`}>
                        <td>{produto.nome}</td>
                        <td>{produto.sku || '-'}</td>
                        <td>{formatarValor(produto.precoUnitario)}</td>
                        <td>{produto.quantidade}</td>
                        <td>{formatarValor(produto.precoTotal)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {venda.observacoes && (
            <div className={styles.observacoesSection}>
              <h3>Observações</h3>
              <div className={styles.observacoesContent}>
                {venda.observacoes}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <p>Pedido não encontrado ou ID inválido.</p>
          <button 
            className={styles.linkButton}
            onClick={() => router.push('/admin/vendas')}
          >
            Voltar para lista de vendas
          </button>
        </div>
      )}
    </div>
  );
} 