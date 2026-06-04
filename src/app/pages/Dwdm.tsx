import { Badge } from '../components/ui/badge';

const channelsData = [
  { mux: 'Mux FLA100 → Mux NAT100 (C21)', freq: '192.4 THz', status: 'TRÂNSITO', capacity: '0 Gbps (Down)' },
  { mux: 'Mux FLA100 → Mux PAR100 (C11)', freq: '192.1 THz', status: 'ATIVO', capacity: '400 Gbps' },
  { mux: 'Mux PEN100 → Mux SMA100 (C04)', freq: '193.5 THz', status: 'ATIVO', capacity: '200 Gbps' },
];

const dataCenters = [
  { code: 'FLA100', city: 'Fortaleza', state: 'CE', role: 'Core Hub' },
  { code: 'NAT100', city: 'Natal', state: 'RN', role: 'Agregação' },
  { code: 'PAR100', city: 'Parnaíba', state: 'PI', role: 'Agregação' },
  { code: 'PEN100', city: 'Peneira', state: 'CE', role: 'Regional' },
  { code: 'SMA100', city: 'São Miguel', state: 'RN', role: 'Regional' },
  { code: 'MAC100', city: 'Maceió', state: 'AL', role: 'Agregação' },
  { code: 'REC100', city: 'Recife', state: 'PE', role: 'Core Hub' },
  { code: 'SSA100', city: 'Salvador', state: 'BA', role: 'Core Hub' },
];

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--bb-surface)', border: '1px solid var(--bb-border)' }}>
      {children}
    </div>
  );
}

export default function Dwdm() {
  return (
    <div className="p-4 sm:p-6 space-y-5">
      <div>
        <h1 className="text-xl font-bold mb-0.5" style={{ color: 'var(--bb-text)' }}>Sistemas Multiplexadores DWDM</h1>
        <p className="text-sm" style={{ color: 'var(--bb-text-muted)' }}>
          Monitoramento de Canais Ópticos entre Data Centers · 8 Lambdas de Alta Capacidade
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* DWDM Diagram */}
        <Card>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h3 className="text-sm font-semibold uppercase tracking-wide" style={{ color: 'var(--bb-text)' }}>Grid de Frequências Ópticas</h3>
            <Badge variant="outline" style={{ color: '#a855f7', borderColor: '#a855f7' }}>LAMBDAS</Badge>
          </div>
          <div className="rounded-lg overflow-hidden" style={{ height: '300px', backgroundColor: 'var(--bb-surface-raised)' }}>
            <svg className="w-full h-full" viewBox="0 0 500 300">
              {/* Backbone */}
              <line x1="50" y1="150" x2="450" y2="150" stroke="var(--bb-border)" strokeWidth="3" strokeDasharray="5,5" />

              {/* Input DCs */}
              <circle cx="100" cy="80" r="6" fill="#a855f7" />
              <line x1="100" y1="80" x2="100" y2="150" stroke="#a855f7" strokeWidth="2" />
              <text x="100" y="68" fill="#a855f7" fontSize="9" textAnchor="middle" fontWeight="bold">C21</text>
              <text x="100" y="58" fill="#a855f7" fontSize="8" textAnchor="middle">FLA100</text>

              <circle cx="170" cy="100" r="6" fill="#6366f1" />
              <line x1="170" y1="100" x2="170" y2="150" stroke="#6366f1" strokeWidth="2" />
              <text x="170" y="88" fill="#6366f1" fontSize="9" textAnchor="middle" fontWeight="bold">C11</text>
              <text x="170" y="78" fill="#6366f1" fontSize="8" textAnchor="middle">FLA100</text>

              <circle cx="240" cy="110" r="6" fill="#3b82f6" />
              <line x1="240" y1="110" x2="240" y2="150" stroke="#3b82f6" strokeWidth="2" />
              <text x="240" y="98" fill="#3b82f6" fontSize="9" textAnchor="middle" fontWeight="bold">C04</text>
              <text x="240" y="88" fill="#3b82f6" fontSize="8" textAnchor="middle">PEN100</text>

              {/* Node total */}
              <circle cx="310" cy="150" r="8" fill="#ef4444" />
              <text x="310" y="172" fill="#ef4444" fontSize="9" textAnchor="middle">NODE</text>

              {/* Output DCs */}
              <circle cx="380" cy="120" r="6" fill="#22c55e" />
              <line x1="310" y1="150" x2="380" y2="120" stroke="#22c55e" strokeWidth="2" />
              <text x="390" y="116" fill="#22c55e" fontSize="8" textAnchor="start">REC100</text>

              <circle cx="380" cy="180" r="6" fill="#22c55e" />
              <line x1="310" y1="150" x2="380" y2="180" stroke="#22c55e" strokeWidth="2" />
              <text x="390" y="184" fill="#22c55e" fontSize="8" textAnchor="start">NAT100</text>

              <circle cx="440" cy="95" r="6" fill="#22c55e" />
              <line x1="380" y1="120" x2="440" y2="95" stroke="#22c55e" strokeWidth="2" />
              <text x="450" y="92" fill="#22c55e" fontSize="8" textAnchor="start">SSA100</text>

              <circle cx="440" cy="210" r="6" fill="#22c55e" />
              <line x1="380" y1="180" x2="440" y2="210" stroke="#22c55e" strokeWidth="2" />
              <text x="450" y="214" fill="#22c55e" fontSize="8" textAnchor="start">MAC100</text>

              {/* EDFA */}
              <rect x="205" y="145" width="70" height="10" fill="#fbbf24" opacity="0.5" rx="2" />
              <text x="240" y="165" fill="#fbbf24" fontSize="8" textAnchor="middle">EDFA Amplifier</text>
            </svg>
          </div>
        </Card>

        {/* Channel Status */}
        <Card>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h3 className="text-sm font-semibold uppercase tracking-wide" style={{ color: 'var(--bb-text)' }}>Status dos Canais - Data Centers</h3>
            <Badge variant="outline" style={{ color: '#22c55e', borderColor: '#22c55e' }}>FREQUÊNCIAS</Badge>
          </div>
          <div className="overflow-x-auto -mx-1">
            <table className="w-full min-w-[380px]">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--bb-border)' }}>
                  {['DATA CENTER / LAMBDA', 'FREQ.', 'STATUS', 'CAPACIDADE'].map((h) => (
                    <th key={h} className="text-left text-xs uppercase py-2 px-2" style={{ color: 'var(--bb-text-dim)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {channelsData.map((channel, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--bb-border-subtle)' }}>
                    <td className="py-3 px-2 text-xs" style={{ color: 'var(--bb-text)' }}>{channel.mux}</td>
                    <td className="py-3 px-2 text-xs font-mono" style={{ color: 'var(--bb-cyan)' }}>{channel.freq}</td>
                    <td className="py-3 px-2">
                      <Badge
                        variant="outline"
                        style={
                          channel.status === 'ATIVO'
                            ? { color: '#22c55e', borderColor: '#22c55e' }
                            : { color: '#ef4444', borderColor: '#ef4444' }
                        }
                      >
                        {channel.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-2 text-xs" style={{ color: 'var(--bb-text-muted)' }}>{channel.capacity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Incident */}
          <div className="mt-5 p-4 rounded-lg" style={{ backgroundColor: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.25)' }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold" style={{ color: '#ef4444' }}>Incidente Detectado</span>
            </div>
            <div className="text-xs space-y-1.5" style={{ color: 'var(--bb-text-muted)' }}>
              <div><span className="font-semibold" style={{ color: 'var(--bb-text)' }}>DATA CENTER:</span> FLA100</div>
              <div><span className="font-semibold" style={{ color: 'var(--bb-text)' }}>CIDADE:</span> Fortaleza - CE</div>
              <div><span className="font-semibold" style={{ color: 'var(--bb-text)' }}>CANAL AFETADO:</span> C21 (Mux FLA100 → NAT100)</div>
              <div><span className="font-semibold" style={{ color: 'var(--bb-text)' }}>DESCRIÇÃO:</span> Falha de AC - Comprometido por Baterias</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Data Center Directory */}
      <Card>
        <h3 className="text-sm font-semibold uppercase tracking-wide mb-4" style={{ color: 'var(--bb-text)' }}>
          Diretório de Data Centers DWDM
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {dataCenters.map((dc) => (
            <div
              key={dc.code}
              className="rounded-lg p-3"
              style={{ backgroundColor: 'var(--bb-surface-raised)', border: '1px solid var(--bb-border)' }}
            >
              <div className="text-sm font-bold font-mono mb-1" style={{ color: 'var(--bb-cyan)' }}>{dc.code}</div>
              <div className="text-xs font-medium" style={{ color: 'var(--bb-text)' }}>{dc.city}</div>
              <div className="text-xs" style={{ color: 'var(--bb-text-dim)' }}>{dc.state} · {dc.role}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
