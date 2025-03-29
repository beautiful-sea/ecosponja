'use client';

import { useEffect, useState } from 'react';
import styles from './styles.module.css';

interface Cliente {
  id: string;
  nome: string;
  email: string;
  created_at: string;
  updated_at: string;
  totalPedidos: number;
}

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [termoBusca, setTermoBusca] = useState('');
  const [clientesFiltrados, setClientesFiltrados] = useState<Cliente[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const carregarClientes = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch('/api/admin/clientes');
        
        if (!response.ok) {
          throw new Error(`Erro ao buscar clientes: ${response.status}`);
        }
        
        const data = await response.json();
        setClientes(data);
        setClientesFiltrados(data);
      } catch (error) {
        console.error('Erro ao carregar clientes:', error);
        setError('Não foi possível carregar os clientes. Tente novamente mais tarde.');
      } finally {
        setIsLoading(false);
      }
    };

    carregarClientes();
  }, []);

  useEffect(() => {
    aplicarFiltros();
  }, [termoBusca, clientes]);

  const aplicarFiltros = () => {
    if (!termoBusca) {
      setClientesFiltrados(clientes);
      return;
    }

    const termo = termoBusca.toLowerCase();
    const filtrados = clientes.filter(cliente => 
      (cliente.nome?.toLowerCase() || '').includes(termo) ||
      (cliente.email?.toLowerCase() || '').includes(termo)
    );
    
    setClientesFiltrados(filtrados);
  };

  function formatarData(dataString: string) {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  return (
    <div className={styles.clientesContainer}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Clientes</h1>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Buscar clientes..."
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
            className={styles.searchInput}
          />
          <svg className={styles.searchIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
      </div>

      {error && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}

      <div className={styles.tableContainer}>
        {isLoading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p>Carregando clientes...</p>
          </div>
        ) : clientesFiltrados.length === 0 ? (
          <div className={styles.emptyState}>
            <h3>Nenhum cliente encontrado</h3>
            <p>Tente diferentes termos de busca.</p>
          </div>
        ) : (
          <table className={styles.clientesTable}>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Pedidos</th>
                <th>Cadastrado em</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {clientesFiltrados.map((cliente) => (
                <tr key={cliente.id}>
                  <td>{cliente.nome}</td>
                  <td>{cliente.email}</td>
                  <td>
                    <span className={styles.pedidoCount}>
                      {cliente.totalPedidos}
                    </span>
                  </td>
                  <td>{formatarData(cliente.created_at)}</td>
                  <td>
                    <div className={styles.actionButtons}>
                      <button 
                        className={styles.viewButton}
                        onClick={() => window.location.href = `/admin/clientes/${cliente.id}`}
                      >
                        Ver pedidos
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