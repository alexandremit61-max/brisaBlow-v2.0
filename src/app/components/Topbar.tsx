import { Search, Bell, Settings, User, Sun, Moon, Menu, MapPin, Clock, Zap, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Input } from './ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useNavigate } from 'react-router';
import { useTheme } from '../context/ThemeContext';
import { useState, useRef, useEffect } from 'react';

const systemAlerts = [
  { id: 1, severity: 'critical', site: 'SÃO LUÍS CORE', description: 'Corte de Fibra - Link Principal Down', location: 'São Luís', time: '13:05', read: false },
  { id: 2, severity: 'critical', site: 'JH20061', description: 'Falha de AC - Comprometido por Baterias', location: 'Maceió', time: '12:44', read: false },
  { id: 3, severity: 'critical', site: 'MDG0905', description: 'Banco de Bateria Crítico - Baixa Voltagem', location: 'Fortaleza', time: '11:13', read: false },
  { id: 4, severity: 'warning', site: 'RECIFE-CLT', description: 'Latência Alta - Degradação do Slot 04', location: 'Recife', time: '14:09', read: true },
  { id: 5, severity: 'warning', site: 'NATAL-CORE', description: 'Alta Elevação de Backstore do Roundtrip', location: 'Natal', time: '10:32', read: true },
  { id: 6, severity: 'info', site: 'FORTALEZA DC', description: 'Operacional - Retabilidade Restaurada', location: 'Fortaleza', time: '11:03', read: true },
];

type TopbarProps = {
  breadcrumb: string;
  onMenuClick: () => void;
};

export default function Topbar({ breadcrumb, onMenuClick }: TopbarProps) {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [notifOpen, setNotifOpen] = useState(false);
  const [alerts, setAlerts] = useState(systemAlerts);
  const notifRef = useRef<HTMLDivElement>(null);

  const unread = alerts.filter((a) => !a.read).length;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const markAllRead = () => setAlerts((prev) => prev.map((a) => ({ ...a, read: true })));
  const markRead = (id: number) => setAlerts((prev) => prev.map((a) => a.id === id ? { ...a, read: true } : a));

  return (
    <header
      className="h-14 flex items-center justify-between px-4 gap-3 border-b"
      style={{ backgroundColor: 'var(--bb-topbar)', borderColor: 'var(--bb-border)' }}
    >
      {/* Left */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg lg:hidden transition-all hover:opacity-70"
          style={{ color: 'var(--bb-text-muted)' }}
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="text-sm font-mono hidden sm:block" style={{ color: 'var(--bb-text-muted)' }}>
          <span style={{ color: 'var(--bb-cyan)' }}>//</span> {breadcrumb}
        </div>
      </div>

      {/* Center - Search */}
      <div className="flex-1 max-w-md hidden md:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--bb-text-dim)' }} />
          <Input
            type="text"
            placeholder="Buscar sites, alarmes, relatórios..."
            className="pl-9 h-9 text-sm border"
            style={{
              backgroundColor: 'var(--bb-surface-alt)',
              borderColor: 'var(--bb-border)',
              color: 'var(--bb-text)',
            }}
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Status */}
        <div
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs"
          style={{ backgroundColor: 'rgba(34,197,94,0.08)', borderColor: 'rgba(34,197,94,0.25)', color: '#22c55e' }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
          <span className="font-medium">ATIVO</span>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg transition-all hover:opacity-70"
          style={{ color: 'var(--bb-text-muted)' }}
          title={theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen((o) => !o)}
            className="relative p-2 rounded-lg transition-all hover:opacity-70"
            style={{ color: 'var(--bb-text-muted)' }}
          >
            <Bell className="w-4 h-4" />
            {unread > 0 && (
              <span className="absolute top-1 right-1 min-w-[16px] h-4 flex items-center justify-center rounded-full text-white px-1"
                style={{ fontSize: '9px', fontWeight: 'bold', backgroundColor: '#ef4444', lineHeight: 1 }}>
                {unread}
              </span>
            )}
          </button>

          {notifOpen && (
            <div
              className="absolute right-0 top-full mt-2 rounded-xl shadow-2xl overflow-hidden z-50"
              style={{ width: '360px', backgroundColor: 'var(--bb-surface)', border: '1px solid var(--bb-border)' }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--bb-border)' }}>
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4" style={{ color: 'var(--bb-text)' }} />
                  <span className="text-sm font-semibold" style={{ color: 'var(--bb-text)' }}>Notificações</span>
                  {unread > 0 && (
                    <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ backgroundColor: 'rgba(239,68,68,0.15)', color: '#ef4444' }}>
                      {unread} novos
                    </span>
                  )}
                </div>
                {unread > 0 && (
                  <button onClick={markAllRead} className="text-xs hover:underline transition-all" style={{ color: 'var(--bb-cyan)' }}>
                    Marcar todos como lidos
                  </button>
                )}
              </div>

              {/* Alert list */}
              <div className="overflow-y-auto" style={{ maxHeight: '400px' }}>
                {alerts.map((alert) => {
                  const color = alert.severity === 'critical' ? '#ef4444' : alert.severity === 'warning' ? '#f97316' : '#22c55e';
                  const Icon = alert.severity === 'critical' ? Zap : alert.severity === 'warning' ? AlertTriangle : CheckCircle2;
                  return (
                    <div
                      key={alert.id}
                      onClick={() => markRead(alert.id)}
                      className="flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors border-b"
                      style={{
                        borderColor: 'var(--bb-border-subtle)',
                        backgroundColor: !alert.read ? `${color}06` : undefined,
                      }}
                    >
                      <div className="flex-shrink-0 mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
                        <Icon className="w-3.5 h-3.5" style={{ color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-xs font-bold font-mono" style={{ color }}>{alert.site}</span>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <span className="text-xs font-mono" style={{ color: 'var(--bb-text-dim)' }}>{alert.time}</span>
                            {!alert.read && <div className="w-1.5 h-1.5 rounded-full bg-red-500" />}
                          </div>
                        </div>
                        <p className="text-xs mt-0.5 leading-snug" style={{ color: 'var(--bb-text-muted)' }}>{alert.description}</p>
                        <div className="flex items-center gap-1 mt-1 text-xs" style={{ color: 'var(--bb-text-dim)' }}>
                          <MapPin className="w-3 h-3" />{alert.location}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="px-4 py-3 border-t" style={{ borderColor: 'var(--bb-border)' }}>
                <button
                  onClick={() => { navigate('/dashboard/alarmes'); setNotifOpen(false); }}
                  className="w-full text-sm py-2 rounded-lg font-medium transition-all hover:opacity-80"
                  style={{ backgroundColor: 'var(--bb-surface-raised)', color: 'var(--bb-text-muted)', border: '1px solid var(--bb-border)' }}
                >
                  Ver todos os alarmes →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="flex items-center gap-2 px-2 py-1.5 rounded-lg transition-all hover:opacity-80"
              style={{ backgroundColor: 'var(--bb-surface-raised)' }}
            >
              <Avatar className="w-7 h-7 border-2" style={{ borderColor: 'var(--bb-cyan)' }}>
                <AvatarImage src="" />
                <AvatarFallback className="text-white text-xs" style={{ background: 'linear-gradient(135deg, #00d9ff, #0099ff)' }}>
                  AR
                </AvatarFallback>
              </Avatar>
              <div className="text-left hidden sm:block">
                <div className="text-xs font-medium" style={{ color: 'var(--bb-text)' }}>Alexandre R.</div>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48" style={{ backgroundColor: 'var(--bb-surface)', borderColor: 'var(--bb-border)' }}>
            <DropdownMenuLabel style={{ color: 'var(--bb-text)' }}>Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator style={{ backgroundColor: 'var(--bb-border)' }} />
            <DropdownMenuItem style={{ color: 'var(--bb-text-muted)' }} onClick={() => navigate('/dashboard/perfil')}>
              <User className="mr-2 h-4 w-4" />
              <span>Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuItem style={{ color: 'var(--bb-text-muted)' }} onClick={() => navigate('/dashboard/configuracoes')}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Configurações</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator style={{ backgroundColor: 'var(--bb-border)' }} />
            <DropdownMenuItem
              className="text-red-400 focus:text-red-400"
              onClick={() => navigate('/')}
            >
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
