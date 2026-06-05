import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { AlertCircle, MapPin, Clock, Filter } from 'lucide-react';

const alarmsData = [
  { id: 1, status: 'RD', severity: 'critical', site: 'SÃO LUÍS CORE', description: 'Corte de Fibra - Link Principal Down', location: 'São Luís', timestamp: '13:05:45' },
  { id: 2, status: 'AMBRA', severity: 'warning', site: 'RECIFE-CLT', description: 'Latência Alta - Degradação do Slot 04', location: 'Recife', timestamp: '14:09:17' },
  { id: 3, status: 'RD', severity: 'critical', site: 'JH20061', description: 'Falha de AC - Comprometido por Baterias', location: 'Maceió · Jacareacanga', timestamp: '12:44:51' },
  { id: 4, status: 'RD', severity: 'critical', site: 'MDG0905', description: 'Banco de Bateria Crítico - Baixa Voltagem', location: 'Fortaleza', timestamp: '11:13:52' },
  { id: 5, status: 'AMBRA', severity: 'warning', site: 'NATAL-CORE', description: 'Alta Elevação de Backstore do Roundtrip', location: 'Natal', timestamp: '10:32:31' },
  { id: 6, status: 'GREEN', severity: 'info', site: 'FORTALEZA DC', description: 'Operacional - Retabilidade Restaurada', location: 'Fortaleza', timestamp: '11:03:51' },
];

const stats = [
  { label: 'Críticos', value: 3, color: '#ef4444', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.2)' },
  { label: 'Alertas', value: 2, color: '#f97316', bg: 'rgba(249,115,22,0.08)', border: 'rgba(249,115,22,0.2)' },
  { label: 'Resolvidos', value: 12, color: '#22c55e', bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.2)' },
  { label: 'Total Hoje', value: 17, color: '#00d9ff', bg: 'rgba(0,217,255,0.08)', border: 'rgba(0,217,255,0.2)' },
];

export default function Alarmes() {
  return (
    <div className="p-4 sm:p-6 space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold mb-0.5" style={{ color: 'var(--bb-text)' }}>Central de Alarmes</h1>
          <p className="text-sm" style={{ color: 'var(--bb-text-muted)' }}>Incidentes de Rede · Criticidade em Tempo Real</p>
        </div>
        <Button size="sm" className="flex items-center gap-2" style={{ backgroundColor: '#ef4444', color: '#fff' }}>
          <Filter className="w-4 h-4" />
          Filtrar
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl p-4 flex items-center justify-between"
            style={{ backgroundColor: stat.bg, border: `1px solid ${stat.border}` }}
          >
            <div>
              <div className="text-xs uppercase mb-1" style={{ color: 'var(--bb-text-dim)' }}>{stat.label}</div>
              <div className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
            </div>
            <AlertCircle className="w-7 h-7 opacity-50" style={{ color: stat.color }} />
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: 'var(--bb-surface)', border: '1px solid var(--bb-border)' }}>
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--bb-border)' }}>
          <h3 className="text-sm font-semibold uppercase tracking-wide" style={{ color: 'var(--bb-text)' }}>Alarmes Ativos</h3>
          <Badge variant="outline" className="animate-pulse" style={{ color: '#ef4444', borderColor: '#ef4444' }}>
            AO VIVO
          </Badge>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--bb-border)' }}>
                {['STATUS', 'SITE', 'DESCRIÇÃO', 'HORA', 'AÇÃO'].map((h) => (
                  <th key={h} className="text-left text-xs uppercase py-3 px-4" style={{ color: 'var(--bb-text-dim)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {alarmsData.map((alarm) => (
                <tr
                  key={alarm.id}
                  className="transition-colors"
                  style={{ borderBottom: '1px solid var(--bb-border-subtle)' }}
                >
                  <td className="py-3.5 px-4">
                    <Badge
                      variant="outline"
                      style={
                        alarm.severity === 'critical'
                          ? { backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444', borderColor: 'rgba(239,68,68,0.4)' }
                          : alarm.severity === 'warning'
                          ? { backgroundColor: 'rgba(249,115,22,0.1)', color: '#f97316', borderColor: 'rgba(249,115,22,0.4)' }
                          : { backgroundColor: 'rgba(34,197,94,0.1)', color: '#22c55e', borderColor: 'rgba(34,197,94,0.4)' }
                      }
                    >
                      {alarm.status}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="text-sm font-medium" style={{ color: 'var(--bb-text)' }}>{alarm.site}</div>
                    <div className="text-xs flex items-center gap-1 mt-0.5" style={{ color: 'var(--bb-text-dim)' }}>
                      <MapPin className="w-3 h-3" />{alarm.location}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="text-sm" style={{ color: 'var(--bb-text-muted)' }}>{alarm.description}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="text-xs flex items-center gap-1" style={{ color: 'var(--bb-text-dim)' }}>
                      <Clock className="w-3 h-3" />{alarm.timestamp}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <Button size="sm" variant="outline" style={{ borderColor: 'var(--bb-cyan)', color: 'var(--bb-cyan)' }}>
                      Analisar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
