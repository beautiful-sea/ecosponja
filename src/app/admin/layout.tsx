'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import './admin.css';

interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  role: string;
}

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  // Não verificar autenticação na página de login
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    // Este código executa apenas no navegador (cliente)
    if (typeof window !== 'undefined' && !isLoginPage) {
      const checkAuth = async () => {
        try {
          const token = localStorage.getItem('adminToken');
          const userData = localStorage.getItem('adminUser');

          if (!token || !userData) {
            console.log('Token ou dados do usuário não encontrados');
            router.push('/admin/login');
            return;
          }

          const userDataParsed = JSON.parse(userData);
          setUser(userDataParsed);
        } catch (error) {
          console.error('Erro ao carregar dados do usuário:', error);
          router.push('/admin/login');
        } finally {
          setLoading(false);
        }
      };

      checkAuth();
    } else {
      setLoading(false);
    }
  }, [router, isLoginPage]);

  const handleLogout = () => {
    try {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      router.push('/admin/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const navigateTo = (path: string) => {
    router.push(`/admin/${path}`);
    setMenuOpen(false);
  };

  // Se estiver na página de login, renderiza apenas o conteúdo
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Exibir tela de carregamento enquanto verifica autenticação
  if (loading) {
    return (
      <div className="admin-loading">
        <p>Carregando...</p>
      </div>
    );
  }

  // Se não estiver autenticado, não renderizar nada
  // (o useEffect já redireciona para a página de login)
  if (!user && !isLoginPage) {
    return null;
  }

  return (
    <div className="admin-layout">
      <aside className={`admin-sidebar ${menuOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <h2>EcoSponja Admin</h2>
          <button className="close-menu-button" onClick={toggleMenu}>
            &times;
          </button>
        </div>
        <nav className="admin-nav">
          <ul>
            <li 
              className={pathname === '/admin/dashboard' ? 'active' : ''} 
              onClick={() => navigateTo('dashboard')}
            >
              Dashboard
            </li>
            <li 
              className={pathname.includes('/admin/vendas') ? 'active' : ''} 
              onClick={() => navigateTo('vendas')}
            >
              Vendas
            </li>
            <li 
              className={pathname.includes('/admin/clientes') ? 'active' : ''} 
              onClick={() => navigateTo('clientes')}
            >
              Clientes
            </li>
            <li 
              className={pathname.includes('/admin/produtos') ? 'active' : ''} 
              onClick={() => navigateTo('produtos')}
            >
              Produtos
            </li>
            <li 
              className={pathname.includes('/admin/configuracoes') ? 'active' : ''} 
              onClick={() => navigateTo('configuracoes')}
            >
              Configurações
            </li>
          </ul>
        </nav>
        <div className="admin-sidebar-footer">
          <button className="logout-button" onClick={handleLogout}>
            Sair
          </button>
        </div>
      </aside>

      <div className="admin-content">
        <header className="admin-header">
          <button className="menu-button" onClick={toggleMenu}>
            ☰
          </button>
          <div className="user-info">
            {user && <span>Olá, {user.name}</span>}
          </div>
        </header>
        <main className="admin-main">
          {children}
        </main>
      </div>
    </div>
  );
} 