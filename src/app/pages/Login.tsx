import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import {
  Lock, Mail, Sun, Moon, User, Phone, Building2,
  Briefcase, IdCard, UserCheck, Eye, EyeOff, ChevronRight,
  CheckCircle2, Clock, Shield, ArrowLeft,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import jangadaLogo from '../../imports/jangada-brisanet.png';

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

type View = 'login' | 'register' | 'pending';

function FieldWrapper({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--bb-text-dim)' }}>
        {label}
      </Label>
      {children}
    </div>
  );
}

const inputStyle = {
  backgroundColor: 'var(--bb-surface-alt)',
  borderColor: 'var(--bb-border)',
  color: 'var(--bb-text)',
};

const selectStyle = {
  ...inputStyle,
  appearance: 'none' as const,
};

export default function Login() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [view, setView] = useState<View>('login');

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPass, setShowLoginPass] = useState(false);

  // Register state
  const [step, setStep] = useState(1);
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [setor, setSetor] = useState('');
  const [cargo, setCargo] = useState('');
  const [gestor, setGestor] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regPassConfirm, setRegPassConfirm] = useState('');
  const [showRegPass, setShowRegPass] = useState(false);
  const [showRegPassConfirm, setShowRegPassConfirm] = useState(false);
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  const formatCPF = (v: string) => {
    const d = v.replace(/\D/g, '').slice(0, 11);
    return d.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
            .replace(/(\d{3})(\d{3})(\d{3})/, '$1.$2.$3')
            .replace(/(\d{3})(\d{3})/, '$1.$2')
            .replace(/(\d{3})/, '$1');
  };

  const formatPhone = (v: string) => {
    const d = v.replace(/\D/g, '').slice(0, 11);
    if (d.length >= 11) return d.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    if (d.length >= 7)  return d.replace(/(\d{2})(\d{4,5})(\d{0,4})/, '($1) $2-$3');
    if (d.length >= 3)  return d.replace(/(\d{2})(\d+)/, '($1) $2');
    return d;
  };

  const validateStep1 = () => {
    const e: Record<string, string> = {};
    if (!nome.trim() || nome.trim().split(' ').length < 2) e.nome = 'Informe o nome completo';
    if (cpf.replace(/\D/g, '').length < 11) e.cpf = 'CPF inválido';
    if (telefone.replace(/\D/g, '').length < 10) e.telefone = 'Telefone inválido';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e: Record<string, string> = {};
    if (!setor) e.setor = 'Selecione o setor';
    if (!cargo) e.cargo = 'Selecione o cargo';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep3 = () => {
    const e: Record<string, string> = {};
    if (!regEmail.includes('@')) e.regEmail = 'E-mail inválido';
    if (regPass.length < 8) e.regPass = 'Mínimo 8 caracteres';
    if (regPass !== regPassConfirm) e.regPassConfirm = 'As senhas não coincidem';
    if (!terms) e.terms = 'Aceite os termos para continuar';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const nextStep = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep3()) return;
    setView('pending');
  };

  const resetRegister = () => {
    setStep(1);
    setNome(''); setCpf(''); setTelefone('');
    setSetor(''); setCargo(''); setGestor('');
    setRegEmail(''); setRegPass(''); setRegPassConfirm('');
    setTerms(false); setErrors({});
    setView('login');
  };

  const stepLabels = ['Dados Pessoais', 'Dados Profissionais', 'Acesso'];

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{ backgroundColor: 'var(--bb-bg)' }}
    >
      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 p-2 rounded-lg transition-all hover:opacity-70"
        style={{ color: 'var(--bb-text-muted)', backgroundColor: 'var(--bb-surface)' }}
      >
        {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </button>

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
            style={{ background: 'linear-gradient(135deg, #00d9ff22, #00d9ff44)', border: '1px solid rgba(0,217,255,0.3)' }}>
            <img src={jangadaLogo} alt="brisaBLOW" className="w-9 h-9 object-contain" />
          </div>
          <h1 className="text-3xl font-black tracking-tight mb-1">
            <span style={{ color: 'var(--bb-text)' }}>brisa</span>
            <span style={{ color: 'var(--bb-orange)' }}>BLOW</span>
          </h1>
          <p className="text-xs tracking-widest uppercase" style={{ color: 'var(--bb-text-dim)' }}>
            Cockpit Técnico & Hub de Automação IA
          </p>
        </div>

        {/* ───── PENDING APPROVAL ───── */}
        {view === 'pending' && (
          <div
            className="rounded-2xl p-8 shadow-xl text-center"
            style={{ backgroundColor: 'var(--bb-surface)', border: '1px solid var(--bb-border)' }}
          >
            <div className="flex justify-center mb-5">
              <div className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(34,197,94,0.12)', border: '2px solid rgba(34,197,94,0.35)' }}>
                <CheckCircle2 className="w-8 h-8 text-green-400" />
              </div>
            </div>
            <h2 className="text-lg font-bold mb-1" style={{ color: 'var(--bb-text)' }}>Cadastro enviado!</h2>
            <p className="text-sm mb-6" style={{ color: 'var(--bb-text-muted)' }}>
              Seu cadastro foi registrado com sucesso e está <strong style={{ color: 'var(--bb-orange)' }}>aguardando aprovação</strong> do administrador do sistema.
            </p>

            <div className="rounded-xl p-4 mb-6 text-left space-y-2"
              style={{ backgroundColor: 'var(--bb-surface-alt)', border: '1px solid var(--bb-border)' }}>
              <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--bb-text-muted)' }}>
                <Clock className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--bb-orange)' }} />
                Prazo de aprovação: até <strong style={{ color: 'var(--bb-text)' }}>1 dia útil</strong>
              </div>
              <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--bb-text-muted)' }}>
                <Mail className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--bb-cyan)' }} />
                Você receberá um e-mail em <strong style={{ color: 'var(--bb-text)' }}>{regEmail}</strong>
              </div>
              <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--bb-text-muted)' }}>
                <Shield className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#a855f7' }} />
                Acesso liberado pelo gestor responsável
              </div>
            </div>

            <button
              onClick={resetRegister}
              className="flex items-center gap-1.5 mx-auto text-sm hover:underline transition-all"
              style={{ color: 'var(--bb-cyan)' }}
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Voltar para o login
            </button>
          </div>
        )}

        {/* ───── MAIN CARD ───── */}
        {view !== 'pending' && (
          <div
            className="rounded-2xl shadow-xl overflow-hidden"
            style={{ backgroundColor: 'var(--bb-surface)', border: '1px solid var(--bb-border)' }}
          >
            {/* Register header */}
            {view === 'register' && (
              <div className="px-7 pt-6 pb-0 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-widest font-semibold mb-0.5" style={{ color: 'var(--bb-cyan)' }}>
                    Cadastro de Colaborador
                  </p>
                  <p className="text-xs" style={{ color: 'var(--bb-text-dim)' }}>
                    Preencha os dados para solicitar acesso ao sistema
                  </p>
                </div>
                <button
                  onClick={() => { setView('login'); setErrors({}); setStep(1); }}
                  className="flex items-center gap-1 text-xs hover:underline transition-all flex-shrink-0 ml-4"
                  style={{ color: 'var(--bb-text-dim)' }}
                >
                  <ArrowLeft className="w-3 h-3" /> Voltar
                </button>
              </div>
            )}

            <div className="p-7">
              {/* ───── LOGIN ───── */}
              {view === 'login' && (
                <form onSubmit={handleLogin} className="space-y-5">
                  <FieldWrapper label="E-mail">
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--bb-text-dim)' }} />
                      <Input
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="seu@brisanet.com.br"
                        className="pl-9 h-10"
                        style={inputStyle}
                        required
                      />
                    </div>
                  </FieldWrapper>

                  <FieldWrapper label="Senha">
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--bb-text-dim)' }} />
                      <Input
                        type={showLoginPass ? 'text' : 'password'}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        className="pl-9 pr-10 h-10"
                        style={inputStyle}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPass(!showLoginPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                        style={{ color: 'var(--bb-text-dim)' }}
                      >
                        {showLoginPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </FieldWrapper>

                  <div className="flex items-center justify-between">
                    <a href="#" className="text-xs hover:underline" style={{ color: 'var(--bb-cyan)' }}>
                      Esqueci minha senha
                    </a>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-11 font-semibold text-sm rounded-xl shadow-lg transition-all hover:opacity-90 active:scale-[0.98]"
                    style={{ background: 'linear-gradient(135deg, #00d9ff, #0099ff)', color: '#000', boxShadow: '0 4px 15px rgba(0,217,255,0.25)' }}
                  >
                    Acessar Cockpit
                  </Button>

                  <p className="text-center text-xs" style={{ color: 'var(--bb-text-dim)' }}>
                    Ainda não tem acesso?{' '}
                    <button type="button" onClick={() => setView('register')} className="hover:underline" style={{ color: 'var(--bb-cyan)' }}>
                      Solicite seu cadastro
                    </button>
                  </p>
                </form>
              )}

              {/* ───── REGISTER ───── */}
              {view === 'register' && (
                <>
                  {/* Step indicator */}
                  <div className="flex items-center gap-1 mb-6">
                    {stepLabels.map((label, i) => {
                      const n = i + 1;
                      const done = n < step;
                      const active = n === step;
                      return (
                        <div key={n} className="flex items-center gap-1 flex-1">
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <div
                              className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                              style={{
                                backgroundColor: done ? 'rgba(34,197,94,0.15)' : active ? 'rgba(0,217,255,0.15)' : 'var(--bb-surface-alt)',
                                border: `1px solid ${done ? 'rgba(34,197,94,0.5)' : active ? 'rgba(0,217,255,0.5)' : 'var(--bb-border)'}`,
                                color: done ? '#22c55e' : active ? 'var(--bb-cyan)' : 'var(--bb-text-dim)',
                              }}
                            >
                              {done ? '✓' : n}
                            </div>
                            <span className="text-xs hidden sm:block" style={{ color: active ? 'var(--bb-text)' : 'var(--bb-text-dim)' }}>
                              {label}
                            </span>
                          </div>
                          {n < 3 && (
                            <div className="flex-1 h-px mx-1" style={{ backgroundColor: done ? 'rgba(34,197,94,0.3)' : 'var(--bb-border)' }} />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Step 1 — Dados Pessoais */}
                  {step === 1 && (
                    <div className="space-y-4">
                      <FieldWrapper label="Nome completo *">
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--bb-text-dim)' }} />
                          <Input
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            placeholder="Nome e sobrenome"
                            className="pl-9 h-10"
                            style={{ ...inputStyle, borderColor: errors.nome ? '#ef4444' : 'var(--bb-border)' }}
                          />
                        </div>
                        {errors.nome && <p className="text-xs text-red-400">{errors.nome}</p>}
                      </FieldWrapper>

                      <FieldWrapper label="CPF *">
                        <div className="relative">
                          <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--bb-text-dim)' }} />
                          <Input
                            value={cpf}
                            onChange={(e) => setCpf(formatCPF(e.target.value))}
                            placeholder="000.000.000-00"
                            className="pl-9 h-10 font-mono"
                            style={{ ...inputStyle, borderColor: errors.cpf ? '#ef4444' : 'var(--bb-border)' }}
                          />
                        </div>
                        {errors.cpf && <p className="text-xs text-red-400">{errors.cpf}</p>}
                      </FieldWrapper>

                      <FieldWrapper label="Telefone / WhatsApp *">
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--bb-text-dim)' }} />
                          <Input
                            value={telefone}
                            onChange={(e) => setTelefone(formatPhone(e.target.value))}
                            placeholder="(85) 99999-0000"
                            className="pl-9 h-10 font-mono"
                            style={{ ...inputStyle, borderColor: errors.telefone ? '#ef4444' : 'var(--bb-border)' }}
                          />
                        </div>
                        {errors.telefone && <p className="text-xs text-red-400">{errors.telefone}</p>}
                      </FieldWrapper>

                      <Button
                        onClick={nextStep}
                        className="w-full h-10 font-semibold text-sm rounded-xl mt-2 flex items-center justify-center gap-2"
                        style={{ background: 'linear-gradient(135deg, #00d9ff, #0099ff)', color: '#000' }}
                      >
                        Próximo <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  )}

                  {/* Step 2 — Dados Profissionais */}
                  {step === 2 && (
                    <div className="space-y-4">
                      <FieldWrapper label="Setor / Área *">
                        <div className="relative">
                          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none z-10" style={{ color: 'var(--bb-text-dim)' }} />
                          <select
                            value={setor}
                            onChange={(e) => setSetor(e.target.value)}
                            className="w-full h-10 pl-9 pr-4 rounded-md border text-sm"
                            style={{ ...selectStyle, borderColor: errors.setor ? '#ef4444' : 'var(--bb-border)' }}
                          >
                            <option value="">Selecione o setor...</option>
                            {SETORES.map((s) => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                        {errors.setor && <p className="text-xs text-red-400">{errors.setor}</p>}
                      </FieldWrapper>

                      <FieldWrapper label="Cargo / Função *">
                        <div className="relative">
                          <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none z-10" style={{ color: 'var(--bb-text-dim)' }} />
                          <select
                            value={cargo}
                            onChange={(e) => setCargo(e.target.value)}
                            className="w-full h-10 pl-9 pr-4 rounded-md border text-sm"
                            style={{ ...selectStyle, borderColor: errors.cargo ? '#ef4444' : 'var(--bb-border)' }}
                          >
                            <option value="">Selecione o cargo...</option>
                            {CARGOS.map((c) => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                        {errors.cargo && <p className="text-xs text-red-400">{errors.cargo}</p>}
                      </FieldWrapper>

                      <FieldWrapper label="Gestor / Supervisor responsável">
                        <div className="relative">
                          <UserCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--bb-text-dim)' }} />
                          <Input
                            value={gestor}
                            onChange={(e) => setGestor(e.target.value)}
                            placeholder="Nome do gestor (opcional)"
                            className="pl-9 h-10"
                            style={inputStyle}
                          />
                        </div>
                      </FieldWrapper>

                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => setStep(1)}
                          className="flex-1 h-10 rounded-xl text-sm font-medium border transition-all hover:opacity-80"
                          style={{ color: 'var(--bb-text-muted)', borderColor: 'var(--bb-border)', backgroundColor: 'var(--bb-surface-alt)' }}
                        >
                          Voltar
                        </button>
                        <Button
                          onClick={nextStep}
                          className="flex-1 h-10 font-semibold text-sm rounded-xl flex items-center justify-center gap-2"
                          style={{ background: 'linear-gradient(135deg, #00d9ff, #0099ff)', color: '#000' }}
                        >
                          Próximo <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Step 3 — Acesso */}
                  {step === 3 && (
                    <form onSubmit={handleRegister} className="space-y-4">
                      <FieldWrapper label="E-mail corporativo *">
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--bb-text-dim)' }} />
                          <Input
                            type="email"
                            value={regEmail}
                            onChange={(e) => setRegEmail(e.target.value)}
                            placeholder="nome@brisanet.com.br"
                            className="pl-9 h-10"
                            style={{ ...inputStyle, borderColor: errors.regEmail ? '#ef4444' : 'var(--bb-border)' }}
                          />
                        </div>
                        {errors.regEmail && <p className="text-xs text-red-400">{errors.regEmail}</p>}
                      </FieldWrapper>

                      <FieldWrapper label="Senha de acesso *">
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--bb-text-dim)' }} />
                          <Input
                            type={showRegPass ? 'text' : 'password'}
                            value={regPass}
                            onChange={(e) => setRegPass(e.target.value)}
                            placeholder="Mínimo 8 caracteres"
                            className="pl-9 pr-10 h-10"
                            style={{ ...inputStyle, borderColor: errors.regPass ? '#ef4444' : 'var(--bb-border)' }}
                          />
                          <button
                            type="button"
                            onClick={() => setShowRegPass(!showRegPass)}
                            className="absolute right-3 top-1/2 -translate-y-1/2"
                            style={{ color: 'var(--bb-text-dim)' }}
                          >
                            {showRegPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        {regPass.length > 0 && (
                          <div className="flex gap-1 mt-1">
                            {[
                              regPass.length >= 8,
                              /[A-Z]/.test(regPass),
                              /[0-9]/.test(regPass),
                              /[^A-Za-z0-9]/.test(regPass),
                            ].map((ok, i) => (
                              <div key={i} className="flex-1 h-1 rounded-full transition-all"
                                style={{ backgroundColor: ok ? '#22c55e' : 'var(--bb-border)' }} />
                            ))}
                          </div>
                        )}
                        {errors.regPass && <p className="text-xs text-red-400">{errors.regPass}</p>}
                      </FieldWrapper>

                      <FieldWrapper label="Confirmar senha *">
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--bb-text-dim)' }} />
                          <Input
                            type={showRegPassConfirm ? 'text' : 'password'}
                            value={regPassConfirm}
                            onChange={(e) => setRegPassConfirm(e.target.value)}
                            placeholder="Repita a senha"
                            className="pl-9 pr-10 h-10"
                            style={{ ...inputStyle, borderColor: errors.regPassConfirm ? '#ef4444' : 'var(--bb-border)' }}
                          />
                          <button
                            type="button"
                            onClick={() => setShowRegPassConfirm(!showRegPassConfirm)}
                            className="absolute right-3 top-1/2 -translate-y-1/2"
                            style={{ color: 'var(--bb-text-dim)' }}
                          >
                            {showRegPassConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        {errors.regPassConfirm && <p className="text-xs text-red-400">{errors.regPassConfirm}</p>}
                      </FieldWrapper>

                      {/* Terms */}
                      <div>
                        <label className="flex items-start gap-3 cursor-pointer group">
                          <div
                            onClick={() => setTerms(!terms)}
                            className="mt-0.5 w-4 h-4 rounded flex-shrink-0 flex items-center justify-center border transition-all"
                            style={{
                              borderColor: errors.terms ? '#ef4444' : terms ? 'var(--bb-cyan)' : 'var(--bb-border)',
                              backgroundColor: terms ? 'rgba(0,217,255,0.15)' : 'var(--bb-surface-alt)',
                            }}
                          >
                            {terms && <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: 'var(--bb-cyan)' }} />}
                          </div>
                          <span className="text-xs leading-relaxed" style={{ color: 'var(--bb-text-dim)' }}>
                            Li e aceito os{' '}
                            <a href="#" className="hover:underline" style={{ color: 'var(--bb-cyan)' }}>Termos de Uso</a>
                            {' '}e a{' '}
                            <a href="#" className="hover:underline" style={{ color: 'var(--bb-cyan)' }}>Política de Segurança</a>
                            {' '}do brisaBLOW. Comprometo-me a utilizar o sistema apenas para fins operacionais autorizados.
                          </span>
                        </label>
                        {errors.terms && <p className="text-xs text-red-400 mt-1">{errors.terms}</p>}
                      </div>

                      <div className="flex gap-2 mt-2">
                        <button
                          type="button"
                          onClick={() => setStep(2)}
                          className="flex-1 h-10 rounded-xl text-sm font-medium border transition-all hover:opacity-80"
                          style={{ color: 'var(--bb-text-muted)', borderColor: 'var(--bb-border)', backgroundColor: 'var(--bb-surface-alt)' }}
                        >
                          Voltar
                        </button>
                        <Button
                          type="submit"
                          className="flex-1 h-10 font-semibold text-sm rounded-xl"
                          style={{ background: 'linear-gradient(135deg, #00d9ff, #0099ff)', color: '#000' }}
                        >
                          Solicitar Acesso
                        </Button>
                      </div>
                    </form>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        <p className="text-center text-xs mt-5" style={{ color: 'var(--bb-text-dim)' }}>
          brisaBLOW v2.0 · Sistema de Monitoramento e Automação
        </p>
      </div>
    </div>
  );
}
