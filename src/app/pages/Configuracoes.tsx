import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { Switch } from '../components/ui/switch';
import { Settings, Bell, Shield, Sparkles, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

function SettingsCard({ icon: Icon, iconColor, title, children }: {
  icon: React.ElementType;
  iconColor: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--bb-surface)', border: '1px solid var(--bb-border)' }}>
      <div className="flex items-center gap-2.5 mb-5" style={{ borderBottom: '1px solid var(--bb-border)', paddingBottom: '1rem' }}>
        <Icon className="w-4 h-4" style={{ color: iconColor }} />
        <h3 className="text-sm font-semibold" style={{ color: 'var(--bb-text)' }}>{title}</h3>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function SettingRow({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="min-w-0">
        <Label className="text-sm" style={{ color: 'var(--bb-text)' }}>{label}</Label>
        {description && <p className="text-xs mt-0.5" style={{ color: 'var(--bb-text-dim)' }}>{description}</p>}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}

export default function Configuracoes() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="p-4 sm:p-6 space-y-5">
      <div>
        <h1 className="text-xl font-bold mb-0.5" style={{ color: 'var(--bb-text)' }}>Configurações do Sistema</h1>
        <p className="text-sm" style={{ color: 'var(--bb-text-muted)' }}>Gerencie preferências, notificações e parâmetros de monitoramento</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* General */}
        <SettingsCard icon={Settings} iconColor="var(--bb-cyan)" title="Configurações Gerais">
          <div className="space-y-1.5">
            <Label className="text-xs" style={{ color: 'var(--bb-text-muted)' }}>Nome do Operador</Label>
            <Input
              defaultValue="Alexandre R."
              style={{ backgroundColor: 'var(--bb-surface-raised)', borderColor: 'var(--bb-border)', color: 'var(--bb-text)' }}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs" style={{ color: 'var(--bb-text-muted)' }}>Intervalo de Atualização (segundos)</Label>
            <Input
              type="number"
              defaultValue="30"
              style={{ backgroundColor: 'var(--bb-surface-raised)', borderColor: 'var(--bb-border)', color: 'var(--bb-text)' }}
            />
          </div>
          <SettingRow
            label={theme === 'dark' ? 'Modo Escuro Ativo' : 'Modo Claro Ativo'}
            description="Alterna entre tema claro e escuro"
          >
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                backgroundColor: theme === 'dark' ? 'rgba(0,217,255,0.1)' : 'rgba(255,107,0,0.1)',
                color: theme === 'dark' ? 'var(--bb-cyan)' : 'var(--bb-orange)',
                border: `1px solid ${theme === 'dark' ? 'rgba(0,217,255,0.3)' : 'rgba(255,107,0,0.3)'}`,
              }}
            >
              {theme === 'dark' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
              {theme === 'dark' ? 'Night' : 'Day'}
            </button>
          </SettingRow>
          <SettingRow label="Auto-Refresh Dashboard" description="Atualização automática de métricas">
            <Switch defaultChecked />
          </SettingRow>
        </SettingsCard>

        {/* Notifications */}
        <SettingsCard icon={Bell} iconColor="#f97316" title="Notificações">
          <SettingRow label="Alertas Críticos" description="Notificar quando houver alarmes críticos">
            <Switch defaultChecked />
          </SettingRow>
          <SettingRow label="Alertas de Latência" description="Avisar quando latência ultrapassar 40ms">
            <Switch defaultChecked />
          </SettingRow>
          <SettingRow label="Notificações por E-mail" description="Receber resumo diário via e-mail">
            <Switch />
          </SettingRow>
          <SettingRow label="Sons de Alerta" description="Reproduzir som ao detectar incidentes">
            <Switch defaultChecked />
          </SettingRow>
        </SettingsCard>

        {/* AI Settings */}
        <SettingsCard icon={Sparkles} iconColor="#a855f7" title="Blow IA Inteligência">
          <div className="space-y-1.5">
            <Label className="text-xs" style={{ color: 'var(--bb-text-muted)' }}>Modelo da IA</Label>
            <select
              className="w-full px-3 py-2 rounded-lg text-sm"
              style={{ backgroundColor: 'var(--bb-surface-raised)', border: '1px solid var(--bb-border)', color: 'var(--bb-text)' }}
            >
              <option value="blow-ia">Blow IA Neural v2.0</option>
              <option value="blow-ia-lite">Blow IA Lite (Rápida)</option>
            </select>
          </div>
          <SettingRow label="Reconhecimento de Voz" description="Habilitar comandos por voz">
            <Switch defaultChecked />
          </SettingRow>
          <SettingRow label="Automação IoT" description="Controle de dispositivos de campo">
            <Switch defaultChecked />
          </SettingRow>
          <SettingRow label="Scripts de Sistema" description="Permitir execução de automações">
            <Switch />
          </SettingRow>
        </SettingsCard>

        {/* Security */}
        <SettingsCard icon={Shield} iconColor="#22c55e" title="Segurança & Dados">
          <SettingRow label="Autenticação 2FA" description="Login com duplo fator">
            <Switch />
          </SettingRow>
          <SettingRow label="Logs de Auditoria" description="Registrar todas as ações do sistema">
            <Switch defaultChecked />
          </SettingRow>
          <SettingRow label="Backup Automático" description="Backup diário de configurações">
            <Switch defaultChecked />
          </SettingRow>
          <div className="pt-2">
            <Button className="w-full text-sm" style={{ backgroundColor: '#ef4444', color: '#fff' }}>
              Limpar Cache & Dados Temporários
            </Button>
          </div>
        </SettingsCard>
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outline" style={{ borderColor: 'var(--bb-border)', color: 'var(--bb-text-muted)' }}>
          Cancelar
        </Button>
        <Button style={{ background: 'linear-gradient(135deg, #00d9ff, #0099ff)', color: '#000' }}>
          Salvar Alterações
        </Button>
      </div>
    </div>
  );
}
