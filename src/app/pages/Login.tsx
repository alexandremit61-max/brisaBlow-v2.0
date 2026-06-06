import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Lock, Mail, Sun, Moon, Eye, EyeOff } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import jangadaLogo from '../../imports/jangada-brisanet.png';

const inputStyle = {
  backgroundColor: 'var(--bb-surface-alt)',
  borderColor: 'var(--bb-border)',
  color: 'var(--bb-text)',
};

export default function Login() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
  };

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
        title={theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
      >
        {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </button>

      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5"
            style={{
              background: 'linear-gradient(135deg, rgba(0,217,255,0.15), rgba(0,217,255,0.3))',
              border: '1px solid rgba(0,217,255,0.35)',
              boxShadow: '0 0 30px rgba(0,217,255,0.12)',
            }}
          >
            <img src={jangadaLogo} alt="BLOW" className="w-10 h-10 object-contain" />
          </div>
          <h1 className="text-3xl font-black tracking-tight mb-1.5">
            <span style={{ color: 'var(--bb-orange)' }}>BLOW</span>
          </h1>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8 shadow-2xl"
          style={{
            backgroundColor: 'var(--bb-surface)',
            border: '1px solid var(--bb-border)',
          }}
        >
          <div className="mb-6">
            <h2 className="text-base font-semibold mb-0.5" style={{ color: 'var(--bb-text)' }}>
              Acesso ao Sistema
            </h2>
            <p className="text-xs" style={{ color: 'var(--bb-text-dim)' }}>
              Use suas credenciais corporativas para entrar
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* E-mail */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--bb-text-dim)' }}>
                E-mail
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--bb-text-dim)' }} />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@brisanet.com.br"
                  className="pl-9 h-11"
                  style={inputStyle}
                  required
                />
              </div>
            </div>

            {/* Senha */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--bb-text-dim)' }}>
                  Senha
                </Label>
                <a href="#" className="text-xs hover:underline transition-all" style={{ color: 'var(--bb-cyan)' }}>
                  Esqueci minha senha
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--bb-text-dim)' }} />
                <Input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-9 pr-10 h-11"
                  style={inputStyle}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-all hover:opacity-70"
                  style={{ color: 'var(--bb-text-dim)' }}
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 font-bold text-sm rounded-xl shadow-lg transition-all hover:opacity-90 active:scale-[0.98] mt-2"
              style={{
                background: 'linear-gradient(135deg, var(--bb-cyan), #0369a1)',
                color: '#fff',
                boxShadow: '0 4px 20px rgba(2,132,199,0.25)',
              }}
            >
              Acesse BLOW
            </Button>
          </form>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: 'var(--bb-text-dim)' }}>
          BLOW v2.0 · Sistema de Monitoramento e Automação
        </p>
      </div>
    </div>
  );
}
