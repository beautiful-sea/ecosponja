'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaHome, FaShoppingCart, FaUsers, FaSearch, FaBars, FaTimes, FaEye, FaGlobe, FaExclamationTriangle, FaBoxOpen, FaBell, FaSignOutAlt } from 'react-icons/fa';

// Tipos de dados
interface Cliente {
  id: string;
  nome: string;
  email: string;
  created_at: string;
  totalPedidos: number;
}

interface Venda {
  id: string;
  numeroPedido: string;
  statusPedido: string;
  valorTotal: number;
  dataPedido: string;
  cliente: {
    id: string;
    nome: string;
    email: string;
  };
}

// Página principal de administração
export default function AdminPage() {
  const router = useRouter();
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Estatísticas
  const [totalVendas, setTotalVendas] = useState(0);
  const [totalClientes, setTotalClientes] = useState(0);
  const [totalReceita, setTotalReceita] = useState(0);
  const [ticketMedio, setTicketMedio] = useState(0);
  const [statusPedidos, setStatusPedidos] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
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

        // Buscar vendas
        const vendasResponse = await fetch('/api/admin/vendas', { headers });
        if (!vendasResponse.ok) throw new Error('Erro ao buscar vendas');
        const vendasData = await vendasResponse.json();
        setVendas(vendasData);
        
        // Calcular estatísticas de vendas
        setTotalVendas(vendasData.length);
        
        const valorTotalVendas = vendasData.reduce((total: number, venda: Venda) => total + venda.valorTotal, 0);
        setTotalReceita(valorTotalVendas);
        
        // Calcular ticket médio
        setTicketMedio(vendasData.length > 0 ? valorTotalVendas / vendasData.length : 0);
        
        // Contar pedidos por status
        const statusCount: Record<string, number> = {};
        vendasData.forEach((venda: Venda) => {
          const status = venda.statusPedido;
          statusCount[status] = (statusCount[status] || 0) + 1;
        });
        setStatusPedidos(statusCount);

        // Buscar clientes
        const clientesResponse = await fetch('/api/admin/clientes', { headers });
        if (!clientesResponse.ok) throw new Error('Erro ao buscar clientes');
        const clientesData = await clientesResponse.json();
        setClientes(clientesData);
        setTotalClientes(clientesData.length);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router]);

  // Logout
  const handleLogout = () => {
    // Remover dados do localStorage
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    
    // Remover o cookie de token
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    
    // Redirecionar para a página de login
    router.push('/admin/login');
  };

  // Filtro de vendas
  const vendasFiltradas = vendas.filter(venda => {
    const termoDeBusca = searchTerm.toLowerCase();
    return (
      venda.numeroPedido.toLowerCase().includes(termoDeBusca) ||
      venda.cliente.nome.toLowerCase().includes(termoDeBusca) ||
      venda.cliente.email.toLowerCase().includes(termoDeBusca) ||
      getStatusLabel(venda.statusPedido).toLowerCase().includes(termoDeBusca)
    );
  });

  // Formatar valores monetários
  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  // Formatar data
  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
  };
  
  // Obter label para status
  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      'delivered': 'Entregue',
      'shipping': 'Em transporte',
      'paid': 'Pago',
      'pending': 'Pendente',
      'canceled': 'Cancelado'
    };
    return statusMap[status] || status;
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } transform fixed z-30 md:translate-x-0 md:relative md:w-64 h-screen bg-white shadow-lg transition-transform duration-300 ease-in-out`}
      >
        <div className="flex flex-col justify-between h-full">
          <div>
            <div className="p-4 border-b">
              <h2 className="text-2xl font-bold text-indigo-600">EcoSponja Admin</h2>
            </div>
            <nav className="mt-6">
              <Link href="/admin" className="flex items-center px-6 py-3 text-indigo-600 bg-gray-100">
                <FaHome className="mr-3" />
                Dashboard
              </Link>
              <Link href="/admin/vendas" className="flex items-center px-6 py-3 text-gray-600 hover:text-indigo-600 hover:bg-gray-100">
                <FaBoxOpen className="mr-3" />
                Vendas
              </Link>
              <Link href="/admin/clientes" className="flex items-center px-6 py-3 text-gray-600 hover:text-indigo-600 hover:bg-gray-100">
                <FaUsers className="mr-3" />
                Clientes
              </Link>
              <Link href="/admin/webhooks" className="flex items-center px-6 py-3 text-gray-600 hover:text-indigo-600 hover:bg-gray-100">
                <FaBell className="mr-3" />
                Webhooks
              </Link>
            </nav>
          </div>
          <div className="p-4 border-t">
            <Link href="/" className="flex items-center mb-4 text-gray-600 hover:text-indigo-600">
              <FaHome className="mr-2" />
              Voltar ao site
            </Link>
            <button 
              onClick={handleLogout}
              className="flex items-center w-full text-gray-600 hover:text-red-600"
            >
              <FaSignOutAlt className="mr-2" />
              Sair
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-x-hidden overflow-y-auto">
        {/* Top Bar */}
        <div className="sticky top-0 z-20 bg-white shadow-sm">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md md:hidden focus:outline-none focus:ring focus:ring-indigo-200"
            >
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
            <h1 className="text-xl font-semibold md:text-2xl">Painel de Controle</h1>
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="py-2 pl-10 pr-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-6">
          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Total Vendas */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
                  <FaShoppingCart className="h-8 w-8" />
                </div>
                <div className="ml-4">
                  <h2 className="text-sm font-medium text-gray-600">Total de Vendas</h2>
                  <p className="text-2xl font-semibold text-gray-800">{totalVendas}</p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100">
                <p className="text-sm text-gray-600">Ticket médio: <span className="font-medium">{formatarMoeda(ticketMedio)}</span></p>
              </div>
            </div>

            {/* Total Receita */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 text-green-600">
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div className="ml-4">
                  <h2 className="text-sm font-medium text-gray-600">Receita Total</h2>
                  <p className="text-2xl font-semibold text-gray-800">{formatarMoeda(totalReceita)}</p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 grid grid-cols-2 gap-2">
                {Object.entries(statusPedidos).slice(0, 2).map(([status, count]) => (
                  <div key={status} className="text-sm">
                    <span className="text-gray-600">{getStatusLabel(status)}: </span>
                    <span className="font-medium">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Clientes */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                  <FaUsers className="h-8 w-8" />
                </div>
                <div className="ml-4">
                  <h2 className="text-sm font-medium text-gray-600">Total de Clientes</h2>
                  <p className="text-2xl font-semibold text-gray-800">{totalClientes}</p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100">
                <p className="text-sm text-gray-600">
                  Média de pedidos: <span className="font-medium">
                    {totalClientes > 0 ? (totalVendas / totalClientes).toFixed(1) : '0'} por cliente
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Recent Sales */}
          <div className="bg-white rounded-lg shadow-md mb-6">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">Vendas Recentes</h2>
            </div>
            <div className="p-4">
              {isLoading ? (
                <div className="flex justify-center p-8">
                  <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              ) : vendasFiltradas.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pedido</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {vendasFiltradas.slice(0, 5).map((venda) => (
                        <tr key={venda.id}>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className="text-sm font-medium text-gray-900">#{venda.numeroPedido}</span>
                          </td>
                          <td className="px-4 py-3">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{venda.cliente.nome}</div>
                              <div className="text-sm text-gray-500">{venda.cliente.email}</div>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className="text-sm text-gray-500">{formatarData(venda.dataPedido)}</span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${venda.statusPedido === 'delivered' ? 'bg-green-100 text-green-800' : ''}
                              ${venda.statusPedido === 'shipping' ? 'bg-blue-100 text-blue-800' : ''}
                              ${venda.statusPedido === 'paid' ? 'bg-yellow-100 text-yellow-800' : ''}
                              ${venda.statusPedido === 'pending' ? 'bg-gray-100 text-gray-800' : ''}
                              ${venda.statusPedido === 'canceled' ? 'bg-red-100 text-red-800' : ''}
                            `}>
                              {getStatusLabel(venda.statusPedido)}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className="text-sm text-gray-900">{formatarMoeda(venda.valorTotal)}</span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                            <Link href={`/admin/vendas/${venda.id}`} className="text-indigo-600 hover:text-indigo-900">
                              Detalhes
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center p-8">
                  <FaExclamationTriangle className="mx-auto h-12 w-12 text-yellow-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">Nenhuma venda encontrada</h3>
                  <p className="mt-1 text-sm text-gray-500">Não há vendas correspondentes aos critérios de busca.</p>
                </div>
              )}
              {vendasFiltradas.length > 5 && (
                <div className="mt-4 text-right">
                  <Link href="/admin/vendas" className="inline-flex items-center font-medium text-indigo-600 hover:text-indigo-500">
                    Ver todas vendas
                    <svg className="ml-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>
              )}
            </div>
          </div>
          
          {/* Top Customers */}
          {!isLoading && clientes.length > 0 && (
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold">Clientes Mais Ativos</h2>
              </div>
              <div className="p-4">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cadastro</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pedidos</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {clientes
                        .sort((a, b) => b.totalPedidos - a.totalPedidos)
                        .slice(0, 5)
                        .map((cliente) => (
                          <tr key={cliente.id}>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className="text-sm font-medium text-gray-900">{cliente.nome}</span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className="text-sm text-gray-500">{cliente.email}</span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className="text-sm text-gray-500">{formatarData(cliente.created_at)}</span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                                {cliente.totalPedidos}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                              <Link href={`/admin/clientes/${cliente.id}`} className="text-indigo-600 hover:text-indigo-900">
                                Detalhes
                              </Link>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
                {clientes.length > 5 && (
                  <div className="mt-4 text-right">
                    <Link href="/admin/clientes" className="inline-flex items-center font-medium text-indigo-600 hover:text-indigo-500">
                      Ver todos clientes
                      <svg className="ml-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 