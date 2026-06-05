import { NavLink } from 'react-router';
import {
  LayoutDashboard,
  Network,
  Radio,
  Antenna,
  AlertTriangle,
  BarChart3,
  Settings,
  ChevronLeft,
  Sparkles,
  X,
} from 'lucide-react';
import jangadaLogo from '../../imports/jangada-brisanet.png';
import { useState } from 'react';

const menuItems = [
  {
    category: 'OPERAÇÃO',
    items: [
      { label: 'Painel', icon: LayoutDashboard, path: '/dashboard' },
      { label: 'METRO', icon: Network, path: '/dashboard/metro' },
      { label: 'DWDM', icon: Radio, path: '/dashboard/dwdm' },
      { label: 'Sites 5G', icon: Antenna, path: '/dashboard/sites-5g' },
    ],
  },
  {
    category: 'INTELIGÊNCIA',
    items: [
      { label: 'Alarmes', icon: AlertTriangle, path: '/dashboard/alarmes', badge: 3 },
      { label: 'Análise', icon: BarChart3, path: '/dashboard/analise' },
      { label: 'Blow IA', icon: Sparkles, path: '/dashboard/blow-ia', aiItem: true },
    ],
  },
  {
    category: 'SISTEMA',
    items: [
      { label: 'Configurações', icon: Settings, path: '/dashboard/configuracoes' },
    ],
  },
];

type SidebarProps = {
  isOpen?: boolean;
  onClose?: () => void;
};

export default function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      {/* Mobile overlay */}
      {onClose && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          flex flex-col transition-all duration-300 z-50
          ${onClose
            ? `fixed left-0 top-0 h-full ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0`
            : 'relative'
          }
          ${isCollapsed ? 'w-16' : 'w-64'}
        `}
        style={{
          backgroundColor: 'var(--bb-sidebar)',
          borderRight: '1px solid var(--bb-sidebar-border)',
        }}
      >
        {/* Logo */}
        <div className="p-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--bb-sidebar-border)' }}>
          {!isCollapsed ? (
            <div className="flex items-center justify-between w-full">
              <button
                className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => window.location.reload()}
                title="Atualizar página"
              >
                <img src={jangadaLogo} alt="Brisanet jangada" className="w-8 h-8 object-contain" />
                <h1 className="text-xl font-bold leading-none">
                  <span style={{ color: 'var(--bb-orange)' }}>BLOW</span>
                </h1>
              </button>
              {onClose && (
                <button onClick={onClose} className="lg:hidden p-1 rounded-md" style={{ color: 'var(--bb-sidebar-muted)' }}>
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            <div className="w-full flex justify-center">
              <img src={jangadaLogo} alt="Brisanet" className="w-8 h-8 object-contain" />
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          {menuItems.map((section, idx) => (
            <div key={idx} className="mb-5">
              {!isCollapsed && (
                <div className="px-3 mb-2 text-xs uppercase tracking-wider" style={{ color: 'var(--bb-sidebar-muted)' }}>
                  {section.category}
                </div>
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/dashboard'}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all group relative ${
                        isActive ? 'active-nav' : ''
                      }`
                    }
                    style={({ isActive }) => ({
                      backgroundColor: isActive
                        ? item.aiItem
                          ? 'rgba(168, 85, 247, 0.15)'
                          : 'rgba(0, 217, 255, 0.1)'
                        : 'transparent',
                      color: isActive
                        ? item.aiItem
                          ? '#a855f7'
                          : 'var(--bb-cyan)'
                        : 'var(--bb-sidebar-muted)',
                      borderLeft: isActive
                        ? `2px solid ${item.aiItem ? '#a855f7' : 'var(--bb-cyan)'}`
                        : '2px solid transparent',
                    })}
                  >
                    <item.icon
                      className="w-4 h-4 flex-shrink-0"
                      style={item.aiItem ? { color: 'inherit' } : undefined}
                    />
                    {!isCollapsed && (
                      <>
                        <span className="flex-1 truncate">{item.label}</span>
                        {item.badge && (
                          <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                            {item.badge}
                          </span>
                        )}
                        {item.aiItem && (
                          <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(168,85,247,0.2)', color: '#a855f7' }}>
                            IA
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3" style={{ borderTop: '1px solid var(--bb-sidebar-border)' }}>
          {!isCollapsed && (
            <div className="mb-3 px-1">
              <div className="text-xs mb-1.5" style={{ color: 'var(--bb-sidebar-muted)' }}>SLA DE REDE</div>
              <div className="flex items-center gap-2">
                <div className="flex-1 rounded-full overflow-hidden h-1.5" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                  <div className="h-full rounded-full" style={{ width: '99.5%', background: 'linear-gradient(90deg, #22c55e, #10b981)' }}></div>
                </div>
                <span className="text-xs font-mono text-green-400">99.5%</span>
              </div>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex w-full items-center justify-center gap-2 px-3 py-2 rounded-md text-xs transition-all hover:opacity-80"
            style={{ color: 'var(--bb-sidebar-muted)' }}
          >
            <ChevronLeft className={`w-4 h-4 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} />
            {!isCollapsed && <span>RECOLHER</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
