import { useState, useRef } from 'react';
import {
  User, Mail, Phone, Building2, Briefcase, UserCheck,
  Lock, Eye, EyeOff, Camera, Save, CheckCircle2, IdCard,
  ShieldCheck, Bell, Pencil,
} from 'lucide-react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';

const SETORES = [
  'Operações de Infraestrutura',
  'Telefonia',
  'IMOC',
  'NOC Monitoramento',
  'Automação',
  'Manutenção de Fibra',
];

const CARGOS = [
  'Assistente de Operações de Redes I',
  'Assistente de Operações de Redes II',
  'Assistente de Operações de Redes III',
  'Analista de Operações de Redes I',
  'Analista de Operações de Redes II',
  'Analista de Operações de Redes III',
  'Assistente de IMOC I',
  'Assistente de IMOC II',
  'Assistente de IMOC III',
  'Analista IMOC I',
  'Analista IMOC II',
  'Analista IMOC III',
  'Assistente de Telefonia I',
  'Assistente de Telefonia II',
  'Assistente de Telefonia III',
  'Analista de Telefonia I',
  'Analista de Telefonia II',
  'Analista de Telefonia III',
  'Analista de Automação I',
  'Analista de Automação II',
  'Analista de Automação III',
];

type Tab = 'perfil' | 'profissional' | 'seguranca' | 'notificacoes';

const inputStyle = {
  backgroundColor: 'var(--bb-surface-alt)',
  borderColor: 'var(--bb-border)',
  color: 'var(--bb-text)',
};

const selectStyle = {
  ...inputStyle,
  appearance: 'none' as const,
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--bb-text-dim)' }}>
        {label}
      </Label>
      {children}
    </div>
  );
}

function SaveBanner({ show, onDismiss }: { show: boolean; onDismiss: () => void }) {
  if (!show) return null;
  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-xl mb-6 text-sm font-medium"
      style={{ backgroundColor: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: '#22c55e' }}
    >
      <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
      Alterações salvas com sucesso!
      <button onClick={onDismiss} className="ml-auto text-xs opacity-60 hover:opacity-100">✕</button>
    </div>
  );
}

export default function Perfil() {
  const [tab, setTab] = useState<Tab>('perfil');
  const [saved, setSaved] = useState(false);

  // Photo
  const [photo, setPhoto] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Pessoal
  const [nome, setNome] = useState('Alexandre Rodrigues');
  const [email, setEmail] = useState('alexandre.rodrigues@brisanet.com.br');
  const [telefone, setTelefone] = useState('(85) 99876-5432');
  const [cpf, setCpf] = useState('000.000.000-00');

  // Profissional
  const [setor, setSetor] = useState('NOC Monitoramento');
  const [cargo, setCargo] = useState('Analista de Operações de Redes II');
  const [gestor, setGestor] = useState('Carlos Menezes');

  // Segurança
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmSenha, setConfirmSenha] = useState('');
  const [showAtual, setShowAtual] = useState(false);
  const [showNova, setShowNova] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [senhaErrors, setSenhaErrors] = useState<Record<string, string>>({});

  // Notificações
  const [notifAlertaCritico, setNotifAlertaCritico] = useState(true);
  const [notifAlertaAviso, setNotifAlertaAviso] = useState(true);
  const [notifRelatorio, setNotifRelatorio] = useState(false);
  const [notifSistema, setNotifSistema] = useState(true);

  const initials = nome.trim().split(' ').filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('');

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPhoto(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 4000);
  };

  const handleSaveSenha = () => {
    const e: Record<string, string> = {};
    if (!senhaAtual) e.senhaAtual = 'Informe a senha atual';
    if (novaSenha.length < 8) e.novaSenha = 'Mínimo 8 caracteres';
    if (novaSenha !== confirmSenha) e.confirmSenha = 'As senhas não coincidem';
    setSenhaErrors(e);
    if (Object.keys(e).length > 0) return;
    setSenhaAtual(''); setNovaSenha(''); setConfirmSenha('');
    setSaved(true);
    setTimeout(() => setSaved(false), 4000);
  };

  const senhaForca = [
    novaSenha.length >= 8,
    /[A-Z]/.test(novaSenha),
    /[0-9]/.test(novaSenha),
    /[^A-Za-z0-9]/.test(novaSenha),
  ];

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'perfil', label: 'Meu Perfil', icon: <User className="w-4 h-4" /> },
    { id: 'profissional', label: 'Dados Profissionais', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'seguranca', label: 'Segurança', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'notificacoes', label: 'Notificações', icon: <Bell className="w-4 h-4" /> },
  ];

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">

      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-xl font-bold mb-1" style={{ color: 'var(--bb-text)' }}>Meu Perfil</h1>
        <p className="text-sm" style={{ color: 'var(--bb-text-dim)' }}>
          Gerencie suas informações pessoais e configurações de acesso
        </p>
      </div>

      {/* Avatar card */}
      <div
        className="rounded-2xl p-6 mb-6 flex items-center gap-5"
        style={{ backgroundColor: 'var(--bb-surface)', border: '1px solid var(--bb-border)' }}
      >
        <div className="relative flex-shrink-0">
          <Avatar className="w-20 h-20 border-2" style={{ borderColor: 'var(--bb-cyan)' }}>
            <AvatarImage src={photo || ''} />
            <AvatarFallback
              className="text-xl font-bold"
              style={{ background: 'linear-gradient(135deg, #00d9ff, #0099ff)', color: '#000' }}
            >
              {initials}
            </AvatarFallback>
          </Avatar>
          <button
            onClick={() => fileRef.current?.click()}
            className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
            style={{ backgroundColor: 'var(--bb-cyan)', color: '#000' }}
            title="Alterar foto"
          >
            <Camera className="w-3.5 h-3.5" />
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoChange}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h2 className="text-base font-bold truncate" style={{ color: 'var(--bb-text)' }}>{nome}</h2>
            <button
              onClick={() => setTab('perfil')}
              className="opacity-50 hover:opacity-100 transition-opacity"
              style={{ color: 'var(--bb-cyan)' }}
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-xs truncate mb-2" style={{ color: 'var(--bb-text-dim)' }}>{email}</p>
          <div className="flex flex-wrap gap-2">
            <span
              className="text-xs px-2.5 py-1 rounded-full font-medium"
              style={{ backgroundColor: 'rgba(0,217,255,0.1)', color: 'var(--bb-cyan)', border: '1px solid rgba(0,217,255,0.2)' }}
            >
              {cargo}
            </span>
            <span
              className="text-xs px-2.5 py-1 rounded-full font-medium"
              style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: 'var(--bb-text-muted)', border: '1px solid var(--bb-border)' }}
            >
              {setor}
            </span>
          </div>
        </div>

        <div
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold flex-shrink-0"
          style={{ backgroundColor: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', color: '#22c55e' }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
          ATIVO
        </div>
      </div>

      {/* Tabs */}
      <div
        className="flex gap-1 p-1 rounded-xl mb-6"
        style={{ backgroundColor: 'var(--bb-surface)', border: '1px solid var(--bb-border)' }}
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => { setTab(t.id); setSaved(false); }}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-all"
            style={{
              backgroundColor: tab === t.id ? 'var(--bb-surface-raised)' : 'transparent',
              color: tab === t.id ? 'var(--bb-cyan)' : 'var(--bb-text-dim)',
              boxShadow: tab === t.id ? '0 1px 4px rgba(0,0,0,0.3)' : 'none',
            }}
          >
            {t.icon}
            <span className="hidden sm:block">{t.label}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div
        className="rounded-2xl p-7"
        style={{ backgroundColor: 'var(--bb-surface)', border: '1px solid var(--bb-border)' }}
      >
        <SaveBanner show={saved} onDismiss={() => setSaved(false)} />

        {/* ── Meu Perfil ── */}
        {tab === 'perfil' && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Nome completo">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--bb-text-dim)' }} />
                  <Input value={nome} onChange={(e) => setNome(e.target.value)} className="pl-9 h-10" style={inputStyle} />
                </div>
              </Field>

              <Field label="CPF">
                <div className="relative">
                  <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--bb-text-dim)' }} />
                  <Input value={cpf} onChange={(e) => setCpf(e.target.value)} className="pl-9 h-10 font-mono" style={inputStyle} placeholder="000.000.000-00" />
                </div>
              </Field>
            </div>

            <Field label="E-mail corporativo">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--bb-text-dim)' }} />
                <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="pl-9 h-10" style={inputStyle} />
              </div>
            </Field>

            <Field label="Telefone / WhatsApp">
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--bb-text-dim)' }} />
                <Input value={telefone} onChange={(e) => setTelefone(e.target.value)} className="pl-9 h-10 font-mono" style={inputStyle} placeholder="(85) 99999-0000" />
              </div>
            </Field>

            <div className="pt-2">
              <Button
                onClick={handleSave}
                className="flex items-center gap-2 px-6 h-10 rounded-xl font-semibold text-sm"
                style={{ background: 'linear-gradient(135deg, #00d9ff, #0099ff)', color: '#000' }}
              >
                <Save className="w-4 h-4" /> Salvar alterações
              </Button>
            </div>
          </div>
        )}

        {/* ── Dados Profissionais ── */}
        {tab === 'profissional' && (
          <div className="space-y-5">
            <Field label="Setor / Área">
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none z-10" style={{ color: 'var(--bb-text-dim)' }} />
                <select
                  value={setor}
                  onChange={(e) => setSetor(e.target.value)}
                  className="w-full h-10 pl-9 pr-4 rounded-md border text-sm"
                  style={selectStyle}
                >
                  {SETORES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </Field>

            <Field label="Cargo / Função">
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none z-10" style={{ color: 'var(--bb-text-dim)' }} />
                <select
                  value={cargo}
                  onChange={(e) => setCargo(e.target.value)}
                  className="w-full h-10 pl-9 pr-4 rounded-md border text-sm"
                  style={selectStyle}
                >
                  {CARGOS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </Field>

            <Field label="Gestor / Supervisor responsável">
              <div className="relative">
                <UserCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--bb-text-dim)' }} />
                <Input value={gestor} onChange={(e) => setGestor(e.target.value)} className="pl-9 h-10" style={inputStyle} placeholder="Nome do gestor" />
              </div>
            </Field>

            <div
              className="rounded-xl p-4 text-xs"
              style={{ backgroundColor: 'rgba(0,217,255,0.05)', border: '1px solid rgba(0,217,255,0.15)', color: 'var(--bb-text-dim)' }}
            >
              Alterações nos dados profissionais podem requerer validação do gestor responsável.
            </div>

            <div className="pt-2">
              <Button
                onClick={handleSave}
                className="flex items-center gap-2 px-6 h-10 rounded-xl font-semibold text-sm"
                style={{ background: 'linear-gradient(135deg, #00d9ff, #0099ff)', color: '#000' }}
              >
                <Save className="w-4 h-4" /> Salvar alterações
              </Button>
            </div>
          </div>
        )}

        {/* ── Segurança ── */}
        {tab === 'seguranca' && (
          <div className="space-y-5">
            <Field label="Senha atual">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--bb-text-dim)' }} />
                <Input
                  type={showAtual ? 'text' : 'password'}
                  value={senhaAtual}
                  onChange={(e) => setSenhaAtual(e.target.value)}
                  placeholder="••••••••"
                  className="pl-9 pr-10 h-10"
                  style={{ ...inputStyle, borderColor: senhaErrors.senhaAtual ? '#ef4444' : 'var(--bb-border)' }}
                />
                <button type="button" onClick={() => setShowAtual(!showAtual)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--bb-text-dim)' }}>
                  {showAtual ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {senhaErrors.senhaAtual && <p className="text-xs text-red-400">{senhaErrors.senhaAtual}</p>}
            </Field>

            <Field label="Nova senha">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--bb-text-dim)' }} />
                <Input
                  type={showNova ? 'text' : 'password'}
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  className="pl-9 pr-10 h-10"
                  style={{ ...inputStyle, borderColor: senhaErrors.novaSenha ? '#ef4444' : 'var(--bb-border)' }}
                />
                <button type="button" onClick={() => setShowNova(!showNova)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--bb-text-dim)' }}>
                  {showNova ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {novaSenha.length > 0 && (
                <div className="space-y-1 mt-2">
                  <div className="flex gap-1">
                    {senhaForca.map((ok, i) => (
                      <div key={i} className="flex-1 h-1 rounded-full transition-all" style={{ backgroundColor: ok ? '#22c55e' : 'var(--bb-border)' }} />
                    ))}
                  </div>
                  <div className="flex gap-4 text-xs" style={{ color: 'var(--bb-text-dim)' }}>
                    <span style={{ color: senhaForca[0] ? '#22c55e' : undefined }}>8+ chars</span>
                    <span style={{ color: senhaForca[1] ? '#22c55e' : undefined }}>Maiúscula</span>
                    <span style={{ color: senhaForca[2] ? '#22c55e' : undefined }}>Número</span>
                    <span style={{ color: senhaForca[3] ? '#22c55e' : undefined }}>Especial</span>
                  </div>
                </div>
              )}
              {senhaErrors.novaSenha && <p className="text-xs text-red-400">{senhaErrors.novaSenha}</p>}
            </Field>

            <Field label="Confirmar nova senha">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--bb-text-dim)' }} />
                <Input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmSenha}
                  onChange={(e) => setConfirmSenha(e.target.value)}
                  placeholder="Repita a nova senha"
                  className="pl-9 pr-10 h-10"
                  style={{ ...inputStyle, borderColor: senhaErrors.confirmSenha ? '#ef4444' : 'var(--bb-border)' }}
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--bb-text-dim)' }}>
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {senhaErrors.confirmSenha && <p className="text-xs text-red-400">{senhaErrors.confirmSenha}</p>}
            </Field>

            <div className="pt-2">
              <Button
                onClick={handleSaveSenha}
                className="flex items-center gap-2 px-6 h-10 rounded-xl font-semibold text-sm"
                style={{ background: 'linear-gradient(135deg, #00d9ff, #0099ff)', color: '#000' }}
              >
                <ShieldCheck className="w-4 h-4" /> Atualizar senha
              </Button>
            </div>
          </div>
        )}

        {/* ── Notificações ── */}
        {tab === 'notificacoes' && (
          <div className="space-y-3">
            {[
              { label: 'Alertas críticos', desc: 'Links down, falha de energia, bateria crítica', value: notifAlertaCritico, set: setNotifAlertaCritico, color: '#ef4444' },
              { label: 'Alertas de aviso', desc: 'Degradações, latência alta, temperaturas elevadas', value: notifAlertaAviso, set: setNotifAlertaAviso, color: '#f97316' },
              { label: 'Relatórios automáticos', desc: 'SLA semanal e resumos de disponibilidade', value: notifRelatorio, set: setNotifRelatorio, color: 'var(--bb-cyan)' },
              { label: 'Avisos do sistema', desc: 'Manutenções programadas e atualizações', value: notifSistema, set: setNotifSistema, color: '#a855f7' },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all"
                style={{ backgroundColor: 'var(--bb-surface-alt)', border: '1px solid var(--bb-border)' }}
                onClick={() => item.set(!item.value)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--bb-text)' }}>{item.label}</p>
                    <p className="text-xs" style={{ color: 'var(--bb-text-dim)' }}>{item.desc}</p>
                  </div>
                </div>
                <div
                  className="w-10 h-6 rounded-full flex items-center transition-all flex-shrink-0"
                  style={{
                    backgroundColor: item.value ? 'rgba(0,217,255,0.2)' : 'var(--bb-surface-raised)',
                    border: `1px solid ${item.value ? 'rgba(0,217,255,0.4)' : 'var(--bb-border)'}`,
                    padding: '2px',
                    justifyContent: item.value ? 'flex-end' : 'flex-start',
                  }}
                >
                  <div
                    className="w-4 h-4 rounded-full transition-all"
                    style={{ backgroundColor: item.value ? 'var(--bb-cyan)' : 'var(--bb-text-dim)' }}
                  />
                </div>
              </div>
            ))}

            <div className="pt-2">
              <Button
                onClick={handleSave}
                className="flex items-center gap-2 px-6 h-10 rounded-xl font-semibold text-sm"
                style={{ background: 'linear-gradient(135deg, #00d9ff, #0099ff)', color: '#000' }}
              >
                <Save className="w-4 h-4" /> Salvar preferências
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
