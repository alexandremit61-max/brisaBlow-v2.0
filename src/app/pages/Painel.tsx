import MetricCard from '../components/MetricCard';
import {
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

const performanceData = [
  { time: '00h', latency: 25 },
  { time: '04h', latency: 22 },
  { time: '08h', latency: 35 },
  { time: '12h', latency: 45 },
  { time: '16h', latency: 38 },
  { time: '20h', latency: 28 },
  { time: '24h', latency: 30 },
];

const statusData = [
  { name: 'Online', value: 1248, color: '#22c55e' },
  { name: 'Alerta', value: 1, color: '#f97316' },
  { name: 'Crítico', value: 0, color: '#ef4444' },
  { name: 'Offline', value: 405, color: '#6b7280' },
];

const wirelessData = [
  { name: '4G', value: 450, color: '#ff6b00' },
  { name: '5G', value: 680, color: '#00d9ff' },
  { name: '5E', value: 750, color: '#a855f7' },
  { name: 'Mesh', value: 520, color: '#22c55e' },
  { name: 'Stlnk', value: 850, color: '#fbbf24' },
];

const healthData = [
  { region: 'Fortaleza', health: 'Fair', score: 91, status: 'Estável' },
  { region: 'Recife', health: 'Ok', score: 95, status: 'Online' },
  { region: 'Natal', health: 'Alerta', score: 62, status: 'Investigando' },
  { region: 'São Luís', health: 'Ok', score: 88, status: 'Online' },
];

const tooltipStyle = {
  contentStyle: { backgroundColor: 'var(--bb-surface-raised)', border: '1px solid var(--bb-border)', borderRadius: '8px', color: 'var(--bb-text)' },
  itemStyle: { color: 'var(--bb-text)' },
  labelStyle: { color: 'var(--bb-text-muted)' },
};

function SectionCard({ title, badge, badgeColor, children }: { title: string; badge?: string; badgeColor?: string; children: React.ReactNode }) {
  return (
    <div
      className="rounded-xl p-5"
      style={{ backgroundColor: 'var(--bb-surface)', border: '1px solid var(--bb-border)' }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide" style={{ color: 'var(--bb-text)' }}>{title}</h3>
        {badge && <span className="text-xs font-medium" style={{ color: badgeColor || 'var(--bb-cyan)' }}>{badge}</span>}
      </div>
      {children}
    </div>
  );
}

export default function Painel() {
  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-full">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold mb-0.5" style={{ color: 'var(--bb-text)' }}>Visão Operacional</h1>
        <p className="text-sm" style={{ color: 'var(--bb-text-muted)' }}>
          Monitoramento em tempo real · <span style={{ color: 'var(--bb-cyan)' }}>1.945</span> redes conectadas
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
        <MetricCard
          title="REDES TOTAIS"
          value="1.248"
          subtitle="+2.2% vs faixa"
          color="cyan"
          trend="up"
          trendValue="+2.2%"
          sparklineData={[40, 45, 42, 48, 50, 55, 52, 58, 60, 65]}
        />
        <MetricCard
          title="SITES ONLINE"
          value="2.654"
          subtitle="176 regiões ativas"
          color="green"
          trend="up"
          trendValue="+15.5%"
          sparklineData={[30, 35, 40, 38, 45, 50, 48, 55, 58, 62]}
        />
        <MetricCard
          title="EM ALERTA"
          value="1"
          subtitle="Status: Fair [28]"
          color="orange"
          trend="down"
          trendValue="Reduzindo"
          sparklineData={[50, 45, 40, 35, 30, 25, 20, 15, 12, 10]}
        />
        <MetricCard
          title="CRÍTICOS"
          value="0"
          subtitle="Nenhum incidente"
          color="green"
          trend="neutral"
          trendValue="Estável"
          sparklineData={[10, 8, 5, 3, 2, 0, 0, 0, 0, 0]}
        />
        <MetricCard
          title="LATÊNCIA"
          value="28ms"
          subtitle="Limite 40ms · 70%"
          color="cyan"
          trend="neutral"
          trendValue="Normal"
          sparklineData={[35, 32, 30, 28, 26, 28, 30, 27, 25, 28]}
        />
        <MetricCard
          title="PERF. IA"
          value="98%"
          subtitle="+1.2% processada"
          color="purple"
          trend="up"
          trendValue="+1.2%"
          sparklineData={[90, 92, 93, 94, 95, 96, 96, 97, 97, 98]}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Status Donut */}
        <SectionCard title="Status Geral Sites" badge="Operational" badgeColor="var(--bb-cyan)">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2} dataKey="value">
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip {...tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2">
            {statusData.map((item) => (
              <div key={item.name} className="flex items-center gap-2 min-w-0">
                <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: item.color }}></div>
                <span className="text-xs truncate" style={{ color: 'var(--bb-text-muted)' }}>{item.name}</span>
                <span className="text-xs font-mono ml-auto" style={{ color: 'var(--bb-text)' }}>{item.value}</span>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Latency Area Chart */}
        <SectionCard title="Latência & Performance" badge="Realtime" badgeColor="#f97316">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={performanceData}>
              <defs>
                <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff6b00" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ff6b00" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--bb-border)" />
              <XAxis dataKey="time" stroke="var(--bb-text-dim)" tick={{ fontSize: 11 }} />
              <YAxis stroke="var(--bb-text-dim)" tick={{ fontSize: 11 }} width={35} />
              <Tooltip {...tooltipStyle} />
              <Area type="monotone" dataKey="latency" stroke="#ff6b00" strokeWidth={2} fillOpacity={1} fill="url(#colorLatency)" />
            </AreaChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Health Summary */}
        <SectionCard title="Health Summary" badge="Hot Reload" badgeColor="#ef4444">
          <div className="overflow-x-auto -mx-1">
            <table className="w-full min-w-[320px]">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--bb-border)' }}>
                  {['REGIÃO', 'HEALTH', 'SCORE', 'STATUS'].map((h) => (
                    <th key={h} className="text-left text-xs uppercase py-2 px-2" style={{ color: 'var(--bb-text-dim)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {healthData.map((row, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--bb-border-subtle)' }}>
                    <td className="py-2.5 px-2 text-sm" style={{ color: 'var(--bb-text)' }}>{row.region}</td>
                    <td className="py-2.5 px-2">
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{
                          backgroundColor:
                            row.health === 'Ok' ? 'rgba(34,197,94,0.12)' :
                            row.health === 'Alerta' ? 'rgba(249,115,22,0.12)' :
                            'rgba(107,114,128,0.12)',
                          color:
                            row.health === 'Ok' ? '#22c55e' :
                            row.health === 'Alerta' ? '#f97316' :
                            'var(--bb-text-muted)',
                        }}
                      >
                        {row.health}
                      </span>
                    </td>
                    <td className="py-2.5 px-2 text-sm font-mono" style={{ color: 'var(--bb-text)' }}>{row.score}</td>
                    <td className="py-2.5 px-2 text-xs" style={{ color: 'var(--bb-text-muted)' }}>{row.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        {/* Wireless Load */}
        <SectionCard title="Wireless Load" badge="Import CSV" badgeColor="#a855f7">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={wirelessData} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--bb-border)" />
              <XAxis dataKey="name" stroke="var(--bb-text-dim)" tick={{ fontSize: 11 }} />
              <YAxis stroke="var(--bb-text-dim)" tick={{ fontSize: 11 }} width={40} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {wirelessData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>
    </div>
  );
}
