'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaHome, FaBoxOpen, FaUsers, FaHistory, FaBell, FaEye, FaPlayCircle, FaSpinner } from 'react-icons/fa';

interface WebhookLog {
  id?: number;
  event_type: string;
  request_body: any;
  response_code: number;
  response_body: string;
  created_at: string;
  error?: string;
}

export default function WebhooksPage() {
  const [logs, setLogs] = useState<WebhookLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<WebhookLog | null>(null);
  const [loadingTest, setLoadingTest] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [logSource, setLogSource] = useState<string>('');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/webhooks/yampi/logs');
      const data = await response.json();
      
      // Verifica de onde vieram os logs
      if (data.source) {
        setLogSource(data.source);
      }
      
      // Normaliza os dados dos logs
      const logsData = data.logs || [];
      
      setLogs(logsData);
    } catch (error) {
      console.error('Erro ao buscar logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendTestWebhook = async () => {
    setLoadingTest(true);
    setTestResult(null);
    
    try {
      const response = await fetch('/api/webhooks/yampi/logs', {
        method: 'POST'
      });
      const data = await response.json();
      setTestResult(data);
      
      // Recarrega os logs após o teste
      await fetchLogs();
    } catch (error) {
      console.error('Erro ao enviar webhook de teste:', error);
      setTestResult({ error: 'Falha ao enviar webhook de teste' });
    } finally {
      setLoadingTest(false);
    }
  };

  const getStatusClass = (code: number) => {
    if (code >= 200 && code < 300) return 'text-green-600';
    if (code >= 400 && code < 500) return 'text-yellow-600';
    if (code >= 500) return 'text-red-600';
    return 'text-gray-600';
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const viewLogDetails = (log: WebhookLog) => {
    setSelectedLog(log);
  };

  const closeLogDetails = () => {
    setSelectedLog(null);
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
              <Link href="/admin" className="flex items-center px-6 py-3 text-gray-600 hover:text-indigo-600 hover:bg-gray-100">
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
              <Link href="/admin/webhooks" className="flex items-center px-6 py-3 text-indigo-600 bg-gray-100">
                <FaBell className="mr-3" />
                Webhooks
              </Link>
            </nav>
          </div>
          <div className="p-4 border-t">
            <Link href="/" className="flex items-center text-gray-600 hover:text-indigo-600">
              <FaHome className="mr-2" />
              Voltar ao site
            </Link>
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
            <h1 className="text-xl font-semibold md:text-2xl">Logs de Webhook</h1>
            <div></div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6">
          <div className="mb-6 bg-white rounded-lg shadow">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border-b">
              <div>
                <h2 className="text-lg font-semibold">Webhooks da Yampi</h2>
                <p className="text-sm text-gray-500">Visualize os logs dos webhooks recebidos</p>
                {logSource && (
                  <p className="mt-1 text-xs text-blue-600">
                    Fonte de dados: <span className="font-semibold">{logSource === 'memory' ? 'Memória temporária' : 'Banco de dados'}</span>
                  </p>
                )}
              </div>
              <div className="mt-3 md:mt-0">
                <button
                  onClick={sendTestWebhook}
                  disabled={loadingTest}
                  className="flex items-center px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {loadingTest ? (
                    <>
                      <FaSpinner className="mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <FaPlayCircle className="mr-2" />
                      Testar Webhook
                    </>
                  )}
                </button>
              </div>
            </div>

            {testResult && (
              <div className={`p-4 mb-4 border-b ${testResult.error ? 'bg-red-50' : 'bg-green-50'}`}>
                <h3 className="font-semibold">{testResult.error ? 'Erro no teste' : 'Teste enviado com sucesso'}</h3>
                <pre className="mt-2 p-2 bg-white rounded text-sm overflow-x-auto">
                  {JSON.stringify(testResult, null, 2)}
                </pre>
              </div>
            )}

            <div className="p-4">
              {loading ? (
                <div className="flex justify-center p-8">
                  <FaSpinner className="w-8 h-8 text-indigo-600 animate-spin" />
                </div>
              ) : logs.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Evento</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {logs.map((log, index) => (
                        <tr key={log.id || index} className="hover:bg-gray-50">
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className="text-sm text-gray-700">{formatDate(log.created_at)}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm font-medium">{log.event_type}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`text-sm font-medium ${getStatusClass(log.response_code)}`}>
                              {log.response_code}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => viewLogDetails(log)}
                              className="flex items-center text-sm text-indigo-600 hover:text-indigo-900"
                            >
                              <FaEye className="mr-1" /> Detalhes
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-6 text-center">
                  <p className="text-gray-500">Nenhum log de webhook encontrado</p>
                  <button
                    onClick={sendTestWebhook}
                    className="mt-4 px-4 py-2 text-sm text-indigo-600 border border-indigo-600 rounded-md hover:bg-indigo-50"
                  >
                    Enviar webhook de teste
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold mb-2">Configuração de Webhook da Yampi</h3>
            <p className="text-sm text-gray-600 mb-4">
              Para receber webhooks da Yampi, configure as seguintes informações no painel da Yampi:
            </p>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="mb-4">
                <h4 className="text-sm font-semibold">URL do Webhook:</h4>
                <div className="flex mt-1">
                  <input
                    type="text"
                    value={typeof window !== 'undefined' ? `${window.location.origin}/api/webhooks/yampi` : '/api/webhooks/yampi'}
                    readOnly
                    className="flex-1 p-2 text-sm bg-white border rounded-l-md focus:outline-none"
                  />
                  <button
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        navigator.clipboard.writeText(`${window.location.origin}/api/webhooks/yampi`);
                      }
                    }}
                    className="px-4 py-2 text-white bg-indigo-600 rounded-r-md hover:bg-indigo-700"
                  >
                    Copiar
                  </button>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold">Eventos recomendados:</h4>
                <ul className="mt-1 ml-5 text-sm list-disc text-gray-700">
                  <li>order.created</li>
                  <li>order.paid</li>
                  <li>order.status_updated</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 mt-6">
            <h3 className="text-lg font-semibold mb-2">Endpoint para Testes de Integração</h3>
            <p className="text-sm text-gray-600 mb-4">
              Se estiver enfrentando problemas com os webhooks, configure um webhook de teste para o seguinte endpoint:
            </p>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="mb-4">
                <h4 className="text-sm font-semibold">URL do Endpoint de Teste:</h4>
                <div className="flex mt-1">
                  <input
                    type="text"
                    value={typeof window !== 'undefined' ? `${window.location.origin}/api/webhooks/yampi/test` : '/api/webhooks/yampi/test'}
                    readOnly
                    className="flex-1 p-2 text-sm bg-white border rounded-l-md focus:outline-none"
                  />
                  <button
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        navigator.clipboard.writeText(`${window.location.origin}/api/webhooks/yampi/test`);
                      }
                    }}
                    className="px-4 py-2 text-white bg-indigo-600 rounded-r-md hover:bg-indigo-700"
                  >
                    Copiar
                  </button>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Este endpoint não valida a assinatura e retorna informações detalhadas sobre a requisição recebida.
                  Use-o apenas para verificar quais cabeçalhos a Yampi está enviando.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Log Details Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-lg">
            <div className="sticky top-0 flex items-center justify-between p-4 bg-white border-b">
              <h3 className="text-xl font-semibold">Detalhes do Webhook</h3>
              <button
                onClick={closeLogDetails}
                className="p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500">Evento</p>
                  <p className="font-medium">{selectedLog.event_type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Data</p>
                  <p className="font-medium">{formatDate(selectedLog.created_at)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Código de Resposta</p>
                  <p className={`font-medium ${getStatusClass(selectedLog.response_code)}`}>{selectedLog.response_code}</p>
                </div>
                {selectedLog.error && (
                  <div>
                    <p className="text-sm text-gray-500">Erro</p>
                    <p className="font-medium text-red-600">{selectedLog.error}</p>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <h4 className="mb-2 text-sm font-semibold">Corpo da Requisição</h4>
                <pre className="p-4 bg-gray-50 rounded-md overflow-x-auto whitespace-pre-wrap">
                  {JSON.stringify(selectedLog.request_body, null, 2)}
                </pre>
              </div>

              <div>
                <h4 className="mb-2 text-sm font-semibold">Resposta</h4>
                <pre className="p-4 bg-gray-50 rounded-md overflow-x-auto whitespace-pre-wrap">
                  {selectedLog.response_body}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 