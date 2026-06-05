import { Outlet, useLocation } from 'react-router';
import { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const breadcrumbMap: Record<string, string> = {
  '/dashboard': 'PAINEL',
  '/dashboard/metro': 'METRO',
  '/dashboard/dwdm': 'DWDM',
  '/dashboard/sites-5g': 'SITES 5G',
  '/dashboard/alarmes': 'ALARMES',
  '/dashboard/analise': 'ANÁLISE',
  '/dashboard/configuracoes': 'CONFIGURAÇÕES',
  '/dashboard/blow-ia': 'BLOW IA',
};

export default function DashboardLayout() {
  const location = useLocation();
  const breadcrumb = breadcrumbMap[location.pathname] || 'DASHBOARD';
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex overflow-hidden" style={{ backgroundColor: 'var(--bb-bg)' }}>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <div className="lg:hidden">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Topbar breadcrumb={breadcrumb} onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
