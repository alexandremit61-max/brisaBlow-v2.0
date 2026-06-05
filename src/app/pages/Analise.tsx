import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const bandwidthData = [
  { region: 'FORTALEZA', usage: 94, capacity: 'Backbone Core', score: 91, color: '#22c55e' },
  { region: 'MDG0905', usage: 62, capacity: 'Backbone Core', score: 95, color: '#00d9ff' },
  { region: 'RECIFE', usage: 71, capacity: 'Backbone Core', score: 73, color: '#fbbf24' },
  { region: 'JUAZEIRO-BA', usage: 41, capacity: 'Backbone Core', score: 62, color: '#f97316' },
  { region: 'JOÃO PESSOA', usage: 73, capacity: 'Backbone Core', score: 88, color: '#22c55e' },
];

const latencyMatrix = [
  { region: 'FORTALEZA', lost: 'E.NELS', jitter: '1.295', sla: '99.6%', color: '#22c55e' },
  { region: 'MDG0905', lost: 'E.NELS', jitter: '9.480', sla: '92.6%', color: '#22c55e' },
  { region: 'RECIFE', lost: 'E.NELS', jitter: '2.192', sla: '99.5%', color: '#22c55e' },
  { region: 'JUAZEIRO-BA', lost: 'E.NELS', jitter: '8.146', sla: '43.1%', color: '#ef4444' },
  { region: 'JOÃO PESSOA', lost: 'E.NELS', jitter: '1.688', sla: '93.0%', color: '#22c55e' },
];

const slaData = [
  { name: 'Disponível', value: 99.5, color: '#22c55e' },
  { name: 'Indisponível', value: 0.5, color: '#ef4444' },
];

const tooltipStyle = {
  contentStyle: { backgroundColor: 'var(--bb-surface-raised)', border: '1px solid var(--bb-border)', borderRadius: '8px' },
  itemStyle: { color: 'var(--bb-text)' },
};

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--bb-surface)', border: '1px solid var(--bb-border)' }}>
      {children}
    </div>
  );
}

export default function Analise() {
  return (
    <div className="p-4 sm:p-6 space-y-5">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold mb-0.5" style={{ color: 'var(--bb-text)' }}>Análise & Performance</h1>
          <p className="text-sm" style={{ color: 'var(--bb-text-muted)' }}>Métricas de banda, latências IP e telemetria de arquitetura</p>
        </div>
        <button
          className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:opacity-80"
          style={{ backgroundColor: 'var(--bb-cyan)', color: '#000' }}
        >
          Filtro: Todas as Regiões
        </button>
      </div>

      {/* Bandwidth */}
      <Card>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h3 className="text-sm font-semibold uppercase tracking-wide" style={{ color: 'var(--bb-text)' }}>Ocupação de Banda Ativa (Backbone Core)</h3>
          <Badge variant="outline" style={{ color: 'var(--bb-cyan)', borderColor: 'var(--bb-cyan)' }}>Realtime</Badge>
        </div>
        <div className="space-y-3">
          {bandwidthData.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-lg"
              style={{ backgroundColor: 'var(--bb-surface-raised)', border: '1px solid var(--bb-border)' }}
            >
              <div className="flex items-center justify-between mb-2 min-w-0">
                <div className="min-w-0">
                  <div className="text-sm font-semibold" style={{ color: 'var(--bb-text)' }}>{item.region}</div>
                  <div className="text-xs" style={{ color: 'var(--bb-text-dim)' }}>{item.capacity}</div>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  <div className="text-base font-bold" style={{ color: item.color }}>{item.usage}%</div>
                  <div className="text-xs" style={{ color: 'var(--bb-text-dim)' }}>Score: {item.score}</div>
                </div>
              </div>
              <Progress value={item.usage} className="h-1.5" />
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* SLA */}
        <Card>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h3 className="text-sm font-semibold uppercase tracking-wide" style={{ color: 'var(--bb-text)' }}>Disponibilidade Média da Rede (SLA)</h3>
            <Badge variant="outline" style={{ color: '#22c55e', borderColor: '#22c55e' }}>✓ Nominal</Badge>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={slaData} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={1} dataKey="value" startAngle={90} endAngle={450}>
                {slaData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip {...tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div className="text-center mt-1">
            <div className="text-3xl font-bold" style={{ color: '#22c55e' }}>99.5%</div>
            <div className="text-xs mt-1" style={{ color: 'var(--bb-text-muted)' }}>Média Global SLA: 99.90%</div>
          </div>
        </Card>

        {/* Latency Matrix */}
        <Card>
          <h3 className="text-sm font-semibold uppercase tracking-wide mb-4" style={{ color: 'var(--bb-text)' }}>Matriz de Latência & Telemetria IP</h3>
          <div className="overflow-x-auto -mx-1">
            <table className="w-full min-w-[320px] text-xs">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--bb-border)' }}>
                  {['REGIÃO', 'PERDA PKT', 'JITTER', 'SLA'].map((h) => (
                    <th key={h} className="text-left py-2 px-2 uppercase" style={{ color: 'var(--bb-text-dim)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {latencyMatrix.map((row, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--bb-border-subtle)' }}>
                    <td className="py-2.5 px-2 font-medium" style={{ color: 'var(--bb-text)' }}>{row.region}</td>
                    <td className="py-2.5 px-2" style={{ color: 'var(--bb-text-muted)' }}>{row.lost}</td>
                    <td className="py-2.5 px-2 font-mono" style={{ color: 'var(--bb-text-muted)' }}>{row.jitter}</td>
                    <td className="py-2.5 px-2 font-bold" style={{ color: row.color }}>{row.sla}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
