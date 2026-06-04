import { Badge } from '../components/ui/badge';

const alertsData = [
  { region: 'Aldeias-ba → Salvador', type: 'DEGRADAÇÃO DE ENLACES', status: 'ATENÇÃO', metric: '-26.5 dBm (Alta)' },
  { region: 'Anel Fortaleza Centro', type: 'Degradação Cabo 05', status: 'NORMAL', metric: '-16.1 dBm (Baixa)' },
  { region: 'Anel Bairro Derby', type: 'Anel METRO Cap', status: 'NORMAL', metric: '-18.4 dBm (Baixa)' },
  { region: 'Anel Pessoa POP', type: 'Cabo Urbano Distribuição', status: 'NORMAL', metric: '-17.8 dBm (Média)' },
];

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl p-5 ${className}`} style={{ backgroundColor: 'var(--bb-surface)', border: '1px solid var(--bb-border)' }}>
      {children}
    </div>
  );
}

export default function Metro() {
  return (
    <div className="p-4 sm:p-6 space-y-5">
      <div>
        <h1 className="text-xl font-bold mb-0.5" style={{ color: 'var(--bb-text)' }}>Monitoramento de Redes METRO</h1>
        <p className="text-sm" style={{ color: 'var(--bb-text-muted)' }}>Distribuição Urbana · Visibilidade de Emendas, Caixas de Passagem e Atenuações</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Topology Map */}
        <Card>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h3 className="text-sm font-semibold uppercase tracking-wide" style={{ color: 'var(--bb-text)' }}>Topologia de Cabos Urbanos</h3>
            <Badge variant="outline" style={{ color: 'var(--bb-cyan)', borderColor: 'var(--bb-cyan)' }}>METRO BRASIL</Badge>
          </div>
          <div className="relative rounded-lg overflow-hidden" style={{ height: '300px', backgroundColor: 'var(--bb-surface-raised)' }}>
            <svg className="w-full h-full" viewBox="0 0 400 300">
              <line x1="50" y1="50" x2="150" y2="100" stroke="#22c55e" strokeWidth="2" />
              <line x1="150" y1="100" x2="250" y2="80" stroke="#22c55e" strokeWidth="2" />
              <line x1="250" y1="80" x2="350" y2="120" stroke="#22c55e" strokeWidth="2" />
              <line x1="150" y1="100" x2="150" y2="180" stroke="#22c55e" strokeWidth="2" />
              <line x1="150" y1="180" x2="250" y2="200" stroke="#22c55e" strokeWidth="2" />
              <line x1="250" y1="200" x2="350" y2="180" stroke="#22c55e" strokeWidth="2" />
              <line x1="50" y1="150" x2="150" y2="180" stroke="#22c55e" strokeWidth="2" />
              <line x1="250" y1="80" x2="250" y2="200" stroke="#22c55e" strokeWidth="2" />
              <circle cx="50" cy="50" r="7" fill="#00d9ff" />
              <text x="50" y="37" fill="#00d9ff" fontSize="10" textAnchor="middle">Fortaleza</text>
              <circle cx="150" cy="100" r="7" fill="#22c55e" />
              <text x="150" y="87" fill="#22c55e" fontSize="10" textAnchor="middle">Messejana</text>
              <circle cx="250" cy="80" r="7" fill="#22c55e" />
              <text x="250" y="67" fill="#22c55e" fontSize="10" textAnchor="middle">Papicu</text>
              <circle cx="350" cy="120" r="7" fill="#22c55e" />
              <text x="350" y="107" fill="#22c55e" fontSize="10" textAnchor="middle">P. Futuro</text>
              <circle cx="50" cy="150" r="7" fill="#22c55e" />
              <text x="50" y="168" fill="#22c55e" fontSize="10" textAnchor="middle">Centro</text>
              <circle cx="150" cy="180" r="7" fill="#22c55e" />
              <text x="150" y="197" fill="#22c55e" fontSize="10" textAnchor="middle">Aldeota</text>
              <circle cx="250" cy="200" r="7" fill="#22c55e" />
              <text x="250" y="217" fill="#22c55e" fontSize="10" textAnchor="middle">Meireles</text>
              <circle cx="350" cy="180" r="7" fill="#22c55e" />
              <text x="350" y="197" fill="#22c55e" fontSize="10" textAnchor="middle">Mucuripe</text>
            </svg>
          </div>
          <div className="mt-3 p-3 rounded-lg" style={{ backgroundColor: 'rgba(0,217,255,0.06)', border: '1px solid rgba(0,217,255,0.2)' }}>
            <p className="text-xs" style={{ color: 'var(--bb-text-muted)' }}>
              <span className="font-semibold" style={{ color: 'var(--bb-cyan)' }}>Monitoramento Urbano:</span>{' '}
              Nodes METRO funcionam bidirecionalmente. Baixa perda detectada. Clique para detalhes OTDR.
            </p>
          </div>
        </Card>

        {/* Alerts */}
        <Card>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h3 className="text-sm font-semibold uppercase tracking-wide" style={{ color: 'var(--bb-text)' }}>Alertas de Infraestrutura METRO</h3>
            <Badge variant="outline" style={{ color: '#f97316', borderColor: '#f97316' }}>OPERA-ESPECÍFICA</Badge>
          </div>
          <div className="space-y-3">
            {alertsData.map((alert, idx) => (
              <div
                key={idx}
                className="p-4 rounded-lg cursor-pointer transition-all hover:scale-[1.01]"
                style={{ backgroundColor: 'var(--bb-surface-raised)', border: '1px solid var(--bb-border)' }}
              >
                <div className="flex items-start justify-between gap-3 mb-1">
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate" style={{ color: 'var(--bb-text)' }}>{alert.region}</div>
                    <div className="text-xs mt-0.5 truncate" style={{ color: 'var(--bb-text-muted)' }}>{alert.type}</div>
                  </div>
                  <Badge
                    variant="outline"
                    className="flex-shrink-0"
                    style={
                      alert.status === 'ATENÇÃO'
                        ? { color: '#f97316', borderColor: '#f97316' }
                        : { color: '#22c55e', borderColor: '#22c55e' }
                    }
                  >
                    {alert.status}
                  </Badge>
                </div>
                <div className="text-xs" style={{ color: 'var(--bb-text-dim)' }}>{alert.metric}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
