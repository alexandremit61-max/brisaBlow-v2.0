import { useState, useRef } from 'react';
import { MapPin, Zap, AlertTriangle, CheckCircle2, Clock, Navigation, XCircle, ChevronRight, RefreshCw, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { Badge } from '../components/ui/badge';

type EnergyStatus = {
  commercial: boolean;
  batteryStatus: 'normal' | 'warning' | 'critical' | 'offline';
  batteryPercent: number;
  autonomyCategory: 12 | 6 | 3;
  autonomyUsedHours: number;
  failureTime: string | null;
};

type Site = {
  id: string;
  code: string;
  name: string;
  address: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  status: 'online' | 'battery' | 'critical' | 'offline';
  infrastructure: string;
  technologies: string[];
  lastUpdate: string;
  energy: EnergyStatus;
};

const sitesData: Site[] = [
  {
    id: '1', code: 'FOR0001', name: 'Fortaleza Centro Hub',
    address: 'Av. Barão de Studart, 1980', city: 'Fortaleza', state: 'CE',
    lat: -3.7327, lng: -38.5270, status: 'online', infrastructure: 'Rooftop',
    technologies: ['5G NR'], lastUpdate: '04/06/2026 14:32:00',
    energy: { commercial: true, batteryStatus: 'normal', batteryPercent: 100, autonomyCategory: 12, autonomyUsedHours: 0, failureTime: null },
  },
  {
    id: '2', code: 'FOR0087', name: 'Fortaleza Messejana',
    address: 'Rua Coronel Matos, 540', city: 'Fortaleza', state: 'CE',
    lat: -3.8295, lng: -38.4960, status: 'battery', infrastructure: 'Greenfield',
    technologies: ['5G NR'], lastUpdate: '04/06/2026 12:44:00',
    energy: { commercial: false, batteryStatus: 'warning', batteryPercent: 58, autonomyCategory: 6, autonomyUsedHours: 2.5, failureTime: '17:10' },
  },
  {
    id: '3', code: 'MRO0005', name: 'Mossoró Alto Base',
    address: 'Rua das Flores, 245', city: 'Mossoró', state: 'RN',
    lat: -5.1875, lng: -37.3440, status: 'critical', infrastructure: 'Greenfield',
    technologies: ['5G NR'], lastUpdate: '04/06/2026 11:13:00',
    energy: { commercial: false, batteryStatus: 'critical', batteryPercent: 18, autonomyCategory: 3, autonomyUsedHours: 2.5, failureTime: '15:45' },
  },
  {
    id: '4', code: 'JUO0001', name: 'Juazeiro-BA Core',
    address: 'Av. Getúlio Vargas, 1200', city: 'Juazeiro', state: 'BA',
    lat: -9.4278, lng: -40.5020, status: 'critical', infrastructure: 'Rooftop',
    technologies: ['5G NR'], lastUpdate: '04/06/2026 13:05:00',
    energy: { commercial: false, batteryStatus: 'critical', batteryPercent: 9, autonomyCategory: 3, autonomyUsedHours: 2.8, failureTime: '14:30' },
  },
  {
    id: '5', code: 'REC0012', name: 'Recife Boa Viagem',
    address: 'Av. Conselheiro Aguiar, 3200', city: 'Recife', state: 'PE',
    lat: -8.1194, lng: -34.9008, status: 'online', infrastructure: 'Rooftop',
    technologies: ['5G NR'], lastUpdate: '04/06/2026 14:28:00',
    energy: { commercial: true, batteryStatus: 'normal', batteryPercent: 100, autonomyCategory: 12, autonomyUsedHours: 0, failureTime: null },
  },
  {
    id: '6', code: 'NAT0003', name: 'Natal Midway',
    address: 'Av. Engenheiro Roberto Freire, 8840', city: 'Natal', state: 'RN',
    lat: -5.8733, lng: -35.1972, status: 'battery', infrastructure: 'Greenfield',
    technologies: ['5G NR'], lastUpdate: '04/06/2026 10:32:00',
    energy: { commercial: false, batteryStatus: 'warning', batteryPercent: 42, autonomyCategory: 6, autonomyUsedHours: 3.5, failureTime: '16:50' },
  },
  {
    id: '7', code: 'SSA0008', name: 'Salvador Pelourinho',
    address: 'Rua da Misericórdia, 130', city: 'Salvador', state: 'BA',
    lat: -12.9714, lng: -38.5124, status: 'online', infrastructure: 'Rooftop',
    technologies: ['5G NR'], lastUpdate: '04/06/2026 14:15:00',
    energy: { commercial: true, batteryStatus: 'normal', batteryPercent: 100, autonomyCategory: 12, autonomyUsedHours: 0, failureTime: null },
  },
  {
    id: '8', code: 'MCE0019', name: 'Maceió Pajuçara',
    address: 'Av. Dr. Antônio Gouveia, 900', city: 'Maceió', state: 'AL',
    lat: -9.6658, lng: -35.7350, status: 'online', infrastructure: 'Greenfield',
    technologies: ['5G NR'], lastUpdate: '04/06/2026 13:55:00',
    energy: { commercial: true, batteryStatus: 'normal', batteryPercent: 100, autonomyCategory: 6, autonomyUsedHours: 0, failureTime: null },
  },
  {
    id: '9', code: 'THE0006', name: 'Teresina Norte',
    address: 'Av. Frei Serafim, 2100', city: 'Teresina', state: 'PI',
    lat: -5.0892, lng: -42.8019, status: 'battery', infrastructure: 'Greenfield',
    technologies: ['5G NR'], lastUpdate: '04/06/2026 09:18:00',
    energy: { commercial: false, batteryStatus: 'warning', batteryPercent: 65, autonomyCategory: 12, autonomyUsedHours: 4.2, failureTime: '21:30' },
  },
];

function getStatusColor(status: Site['status']) {
  if (status === 'online') return '#22c55e';
  if (status === 'battery') return '#f97316';
  if (status === 'critical') return '#ef4444';
  return '#6b7280';
}

function getStatusLabel(status: Site['status']) {
  if (status === 'online') return 'Operacional';
  if (status === 'battery') return 'Em Bateria';
  if (status === 'critical') return 'Crítico';
  return 'Offline';
}

function getBatteryColor(pct: number) {
  if (pct > 50) return '#22c55e';
  if (pct > 25) return '#f97316';
  return '#ef4444';
}

function AutonomyBar({ percent, label, color }: { percent: number; label: string; color: string }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs" style={{ color: 'var(--bb-text-muted)' }}>{label}</span>
        <span className="text-xs font-bold font-mono" style={{ color }}>{percent}%</span>
      </div>
      <div className="h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bb-surface-raised)' }}>
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${percent}%`, backgroundColor: color, boxShadow: `0 0 8px ${color}60` }}
        />
      </div>
    </div>
  );
}

function SiteDetail({ site, onClose }: { site: Site; onClose: () => void }) {
  const autonomyRemaining = site.energy.autonomyCategory - site.energy.autonomyUsedHours;
  const autonomyPct = Math.round((autonomyRemaining / site.energy.autonomyCategory) * 100);
  const battColor = getBatteryColor(site.energy.batteryPercent);
  const mapsUrl = `https://www.google.com/maps?q=${site.lat},${site.lng}`;

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="flex items-start justify-between p-5 border-b" style={{ borderColor: 'var(--bb-border)' }}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-xs font-bold px-2 py-0.5 rounded font-mono"
              style={{
                backgroundColor: `${getStatusColor(site.status)}15`,
                color: getStatusColor(site.status),
                border: `1px solid ${getStatusColor(site.status)}40`,
              }}
            >
              {site.status === 'critical' || site.status === 'battery' ? '⚡ FALTA DE AC' : '✓ AC NORMAL'}
            </span>
          </div>
          <h2 className="text-xl font-bold" style={{ color: 'var(--bb-text)' }}>{site.code}</h2>
          <p className="text-sm" style={{ color: 'var(--bb-text-muted)' }}>{site.name}</p>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:opacity-70 transition-all" style={{ color: 'var(--bb-text-dim)' }}>
          <XCircle className="w-5 h-5" />
        </button>
      </div>

      <div className="p-5 space-y-5">
        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs uppercase mb-1" style={{ color: 'var(--bb-text-dim)' }}>Estação Base</div>
            <div className="text-sm font-semibold" style={{ color: 'var(--bb-text)' }}>{site.name}</div>
          </div>
          <div>
            <div className="text-xs uppercase mb-1" style={{ color: 'var(--bb-text-dim)' }}>Localidade</div>
            <div className="text-sm font-semibold" style={{ color: 'var(--bb-text)' }}>{site.city} ({site.state})</div>
          </div>
          <div>
            <div className="text-xs uppercase mb-1" style={{ color: 'var(--bb-text-dim)' }}>Infraestrutura</div>
            <div className="text-sm" style={{ color: 'var(--bb-text-muted)' }}>{site.infrastructure}</div>
          </div>
          <div>
            <div className="text-xs uppercase mb-1" style={{ color: 'var(--bb-text-dim)' }}>Status Elétrico</div>
            <div className="text-sm font-semibold" style={{ color: getStatusColor(site.status) }}>
              {site.energy.commercial ? 'AC Presente' : 'Operando por Baterias'}
              {site.energy.batteryStatus === 'critical' && ' / Crítico'}
            </div>
          </div>
          <div className="col-span-2">
            <div className="text-xs uppercase mb-1" style={{ color: 'var(--bb-text-dim)' }}>Endereço</div>
            <div className="text-sm" style={{ color: 'var(--bb-text-muted)' }}>{site.address}, {site.city} - {site.state}</div>
          </div>
          <div>
            <div className="text-xs uppercase mb-1" style={{ color: 'var(--bb-text-dim)' }}>Latitude Real</div>
            <div className="text-sm font-mono" style={{ color: 'var(--bb-cyan)' }}>{site.lat.toFixed(6)}</div>
          </div>
          <div>
            <div className="text-xs uppercase mb-1" style={{ color: 'var(--bb-text-dim)' }}>Longitude Real</div>
            <div className="text-sm font-mono" style={{ color: 'var(--bb-cyan)' }}>{site.lng.toFixed(6)}</div>
          </div>
        </div>

        {/* Technologies */}
        <div>
          <div className="text-xs uppercase mb-2" style={{ color: 'var(--bb-text-dim)' }}>Tecnologias Instaladas</div>
          <div className="flex flex-wrap gap-2">
            {site.technologies.map((tech) => (
              <span key={tech} className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ backgroundColor: 'rgba(0,217,255,0.1)', color: 'var(--bb-cyan)', border: '1px solid rgba(0,217,255,0.25)' }}>
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Mini Map */}
        <div>
          <div className="text-xs uppercase mb-2" style={{ color: 'var(--bb-text-dim)' }}>Localização</div>
          <div
            className="relative rounded-xl overflow-hidden"
            style={{ height: '140px', backgroundColor: 'var(--bb-surface-raised)', border: '1px solid var(--bb-border)' }}
          >
            {/* Simulated map background */}
            <svg className="w-full h-full" viewBox="0 0 300 140" preserveAspectRatio="xMidYMid slice">
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="var(--bb-border)" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="300" height="140" fill="var(--bb-surface-raised)" />
              <rect width="300" height="140" fill="url(#grid)" />
              {/* Roads */}
              <line x1="0" y1="70" x2="300" y2="70" stroke="var(--bb-border)" strokeWidth="2" />
              <line x1="150" y1="0" x2="150" y2="140" stroke="var(--bb-border)" strokeWidth="2" />
              <line x1="0" y1="35" x2="300" y2="105" stroke="var(--bb-border)" strokeWidth="1" />
              {/* Pulse rings */}
              <circle cx="150" cy="70" r="28" fill="none" stroke={getStatusColor(site.status)} strokeWidth="1" opacity="0.3" />
              <circle cx="150" cy="70" r="18" fill="none" stroke={getStatusColor(site.status)} strokeWidth="1" opacity="0.5" />
              <circle cx="150" cy="70" r="8" fill={getStatusColor(site.status)} opacity="0.25" />
              <circle cx="150" cy="70" r="5" fill={getStatusColor(site.status)} />
              {/* Pin */}
              <line x1="150" y1="70" x2="150" y2="55" stroke={getStatusColor(site.status)} strokeWidth="1.5" />
              <circle cx="150" cy="52" r="4" fill={getStatusColor(site.status)} />
            </svg>
            <div className="absolute bottom-2 left-2 text-xs px-2 py-0.5 rounded font-mono" style={{ backgroundColor: 'var(--bb-surface)', color: 'var(--bb-text-dim)', border: '1px solid var(--bb-border)' }}>
              {site.lat.toFixed(4)}, {site.lng.toFixed(4)}
            </div>
          </div>
        </div>

        {/* Energy / Autonomy */}
        {!site.energy.commercial && (
          <div className="rounded-xl p-4 space-y-4" style={{ backgroundColor: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)' }}>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" style={{ color: '#ef4444' }} />
              <span className="text-sm font-semibold" style={{ color: '#ef4444' }}>Monitoramento de Autonomia - Bateria Huawei Li</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg p-3" style={{ backgroundColor: 'var(--bb-surface-raised)' }}>
                <div className="text-xs mb-1" style={{ color: 'var(--bb-text-dim)' }}>Energia Comercial</div>
                <div className="font-semibold" style={{ color: '#ef4444' }}>Ausente (AC Off)</div>
              </div>
              <div className="rounded-lg p-3" style={{ backgroundColor: 'var(--bb-surface-raised)' }}>
                <div className="text-xs mb-1" style={{ color: 'var(--bb-text-dim)' }}>Categoria Autonomia</div>
                <div className="font-semibold" style={{ color: battColor }}>{site.energy.autonomyCategory}h de backup</div>
              </div>
              <div className="rounded-lg p-3" style={{ backgroundColor: 'var(--bb-surface-raised)' }}>
                <div className="text-xs mb-1" style={{ color: 'var(--bb-text-dim)' }}>Tempo Consumido</div>
                <div className="font-semibold font-mono" style={{ color: 'var(--bb-text)' }}>{site.energy.autonomyUsedHours.toFixed(1)}h</div>
              </div>
              <div className="rounded-lg p-3" style={{ backgroundColor: 'var(--bb-surface-raised)' }}>
                <div className="text-xs mb-1" style={{ color: 'var(--bb-text-dim)' }}>Autonomia Restante</div>
                <div className="font-semibold font-mono" style={{ color: battColor }}>
                  {(site.energy.autonomyCategory - site.energy.autonomyUsedHours).toFixed(1)}h
                </div>
              </div>
            </div>

            <AutonomyBar percent={site.energy.batteryPercent} label="Carga das Baterias" color={battColor} />
            <AutonomyBar percent={autonomyPct} label="Autonomia Restante" color={battColor} />

            {site.energy.failureTime && (
              <div className="flex items-center gap-2 p-3 rounded-lg" style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
                <Clock className="w-4 h-4 flex-shrink-0" style={{ color: '#ef4444' }} />
                <div>
                  <div className="text-xs" style={{ color: 'var(--bb-text-dim)' }}>Previsão de esgotamento</div>
                  <div className="text-sm font-bold font-mono" style={{ color: '#ef4444' }}>Hoje às {site.energy.failureTime}</div>
                </div>
              </div>
            )}
          </div>
        )}

        {site.energy.commercial && (
          <div className="rounded-xl p-4 flex items-center gap-3" style={{ backgroundColor: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)' }}>
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: '#22c55e' }} />
            <div>
              <div className="text-sm font-semibold" style={{ color: '#22c55e' }}>Energia Comercial Presente</div>
              <div className="text-xs" style={{ color: 'var(--bb-text-dim)' }}>Baterias Huawei em carga plena · Autonomia: {site.energy.autonomyCategory}h</div>
            </div>
          </div>
        )}

        {/* Last update */}
        <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--bb-text-dim)' }}>
          <RefreshCw className="w-3 h-3" />
          Última atualização: {site.lastUpdate}
        </div>
      </div>

      {/* Maps Button */}
      <div className="p-4 border-t mt-auto" style={{ borderColor: 'var(--bb-border)' }}>
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90 active:scale-[0.98]"
          style={{ backgroundColor: '#ef4444', color: '#fff', boxShadow: '0 4px 12px rgba(239,68,68,0.3)' }}
        >
          <Navigation className="w-4 h-4" />
          Despachar Plantão Técnico (Google Maps)
        </a>
      </div>
    </div>
  );
}

type FilterKey = 'battery' | 'noAC' | 'critical';

function FilteredList({ filter, sites, onSelect, onClose }: {
  filter: FilterKey;
  sites: Site[];
  onSelect: (s: Site) => void;
  onClose: () => void;
}) {
  const labels: Record<FilterKey, string> = {
    battery: 'Alerta de Bateria',
    noAC: 'Sem Energia AC',
    critical: 'Autonomia Crítica',
  };
  const colors: Record<FilterKey, string> = {
    battery: '#f97316',
    noAC: '#f97316',
    critical: '#ef4444',
  };
  const color = colors[filter];

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ backgroundColor: 'var(--bb-surface)' }}>
      <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--bb-border)' }}>
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" style={{ color }} />
          <span className="text-sm font-semibold" style={{ color }}>{labels[filter]}</span>
          <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ backgroundColor: `${color}20`, color }}>
            {sites.length}
          </span>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:opacity-70 transition-all" style={{ color: 'var(--bb-text-dim)' }}>
          <XCircle className="w-4 h-4" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {sites.length === 0 && (
          <p className="text-sm text-center py-8" style={{ color: 'var(--bb-text-dim)' }}>Nenhum site nesta categoria.</p>
        )}
        {sites.map((site) => {
          const battColor = getBatteryColor(site.energy.batteryPercent);
          return (
            <button
              key={site.id}
              onClick={() => onSelect(site)}
              className="w-full text-left rounded-xl p-3 transition-all hover:scale-[1.01]"
              style={{ backgroundColor: 'var(--bb-surface-raised)', border: `1px solid ${getStatusColor(site.status)}30` }}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <span className="text-sm font-bold font-mono" style={{ color: getStatusColor(site.status) }}>{site.code}</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0"
                  style={{ backgroundColor: `${getStatusColor(site.status)}15`, color: getStatusColor(site.status) }}>
                  {getStatusLabel(site.status)}
                </span>
              </div>
              <div className="text-xs mb-2" style={{ color: 'var(--bb-text-muted)' }}>{site.name}</div>
              <div className="flex items-center gap-1 text-xs mb-2" style={{ color: 'var(--bb-text-dim)' }}>
                <MapPin className="w-3 h-3" />{site.city} - {site.state}
              </div>
              {!site.energy.commercial && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs" style={{ color: 'var(--bb-text-dim)' }}>Bateria</span>
                    <span className="text-xs font-bold font-mono" style={{ color: battColor }}>{site.energy.batteryPercent}%</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bb-border)' }}>
                    <div className="h-full rounded-full" style={{ width: `${site.energy.batteryPercent}%`, backgroundColor: battColor }} />
                  </div>
                  {site.energy.failureTime && (
                    <div className="flex items-center gap-1 mt-1.5 text-xs" style={{ color: '#ef4444' }}>
                      <Clock className="w-3 h-3" />Esgotamento previsto: {site.energy.failureTime}
                    </div>
                  )}
                </div>
              )}
              <div className="flex items-center justify-end mt-2 gap-1 text-xs" style={{ color: 'var(--bb-cyan)' }}>
                Ver detalhes <ChevronRight className="w-3 h-3" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TowerIcon({ cx, cy, color, size = 1, isSelected }: { cx: number; cy: number; color: string; size?: number; isSelected: boolean }) {
  const s = size;
  return (
    <g transform={`translate(${cx}, ${cy})`} style={{ cursor: 'pointer' }}>
      {isSelected && <circle cx={0} cy={-4 * s} r={20 * s} fill={color} opacity="0.12" />}
      {/* Base legs */}
      <line x1={-6 * s} y1={10 * s} x2={-1.5 * s} y2={0} stroke={color} strokeWidth={1.5 * s} strokeLinecap="round" />
      <line x1={6 * s} y1={10 * s} x2={1.5 * s} y2={0} stroke={color} strokeWidth={1.5 * s} strokeLinecap="round" />
      {/* Base platform */}
      <line x1={-7 * s} y1={10 * s} x2={7 * s} y2={10 * s} stroke={color} strokeWidth={2 * s} strokeLinecap="round" />
      {/* Cross bar */}
      <line x1={-4 * s} y1={5 * s} x2={4 * s} y2={5 * s} stroke={color} strokeWidth={1 * s} strokeLinecap="round" />
      {/* Mast */}
      <line x1={0} y1={0} x2={0} y2={-12 * s} stroke={color} strokeWidth={2 * s} strokeLinecap="round" />
      {/* Antenna arms */}
      <line x1={-6 * s} y1={-8 * s} x2={6 * s} y2={-8 * s} stroke={color} strokeWidth={1.8 * s} strokeLinecap="round" />
      <line x1={-4 * s} y1={-11 * s} x2={4 * s} y2={-11 * s} stroke={color} strokeWidth={1.2 * s} strokeLinecap="round" />
      {/* Beacon top */}
      <circle cx={0} cy={-13 * s} r={1.8 * s} fill={color} />
      {/* Pulse ring */}
      <circle cx={0} cy={-13 * s} r={4 * s} fill="none" stroke={color} strokeWidth={1 * s} opacity="0.5">
        <animate attributeName="r" values={`${4 * s};${9 * s};${4 * s}`} dur="2.2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.5;0;0.5" dur="2.2s" repeatCount="indefinite" />
      </circle>
    </g>
  );
}

export default function Sites5G() {
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterKey | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 });
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const BASE_W = 560, BASE_H = 380;
  const clampZoom = (z: number) => Math.min(4, Math.max(1, z));

  const vw = BASE_W / zoom;
  const vh = BASE_H / zoom;
  const maxPanX = (BASE_W - vw) / 2;
  const maxPanY = (BASE_H - vh) / 2;
  const clampPan = (x: number, y: number) => ({
    x: Math.max(-maxPanX, Math.min(maxPanX, x)),
    y: Math.max(-maxPanY, Math.min(maxPanY, y)),
  });
  const vx = (BASE_W - vw) / 2 + pan.x;
  const vy = (BASE_H - vh) / 2 + pan.y;
  const mapVB = `${vx} ${vy} ${vw} ${vh}`;

  const doZoom = (delta: number) => {
    const newZ = clampZoom(+(zoom + delta).toFixed(2));
    setZoom(newZ);
    if (newZ === 1) setPan({ x: 0, y: 0 });
  };

  const handleMapMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    setLastMouse({ x: e.clientX, y: e.clientY });
    e.preventDefault();
  };
  const handleMapMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    const dx = e.clientX - lastMouse.x;
    const dy = e.clientY - lastMouse.y;
    const cw = mapContainerRef.current?.clientWidth || BASE_W;
    const ch = mapContainerRef.current?.clientHeight || BASE_H;
    const svgDx = -(dx * vw / cw);
    const svgDy = -(dy * vh / ch);
    setPan((p) => clampPan(p.x + svgDx, p.y + svgDy));
    setLastMouse({ x: e.clientX, y: e.clientY });
  };
  const handleMapMouseUp = () => setDragging(false);

  const total = sitesData.length;
  const online = sitesData.filter((s) => s.status === 'online').length;
  const onBattery = sitesData.filter((s) => s.status === 'battery').length;
  const critical = sitesData.filter((s) => s.status === 'critical').length;
  const noAC = sitesData.filter((s) => !s.energy.commercial).length;

  const filteredSites: Record<FilterKey, Site[]> = {
    battery: sitesData.filter((s) => s.status === 'battery'),
    noAC: sitesData.filter((s) => !s.energy.commercial),
    critical: sitesData.filter((s) => s.status === 'critical'),
  };

  const summaryStats: { label: string; value: number; color: string; bg: string; border: string; filter: FilterKey | null }[] = [
    { label: 'Total Sites', value: total, color: 'var(--bb-cyan)', bg: 'rgba(0,217,255,0.08)', border: 'rgba(0,217,255,0.2)', filter: null },
    { label: 'Operacionais', value: online, color: '#22c55e', bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.2)', filter: null },
    { label: 'Alerta de Bateria', value: onBattery, color: '#f97316', bg: 'rgba(249,115,22,0.08)', border: 'rgba(249,115,22,0.2)', filter: 'battery' },
    { label: 'Sem AC', value: noAC, color: '#f97316', bg: 'rgba(249,115,22,0.08)', border: 'rgba(249,115,22,0.2)', filter: 'noAC' },
    { label: 'Autonomia Crítica', value: critical, color: '#ef4444', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.2)', filter: 'critical' },
  ];

  const handleStatClick = (filter: FilterKey | null) => {
    if (!filter) return;
    setSelectedSite(null);
    setActiveFilter((prev) => (prev === filter ? null : filter));
  };

  const handleSelectSite = (site: Site) => {
    setSelectedSite(site);
    setActiveFilter(null);
  };

  // Incidents (no AC)
  const incidents = sitesData.filter((s) => !s.energy.commercial);

  const showRightPanel = selectedSite || activeFilter;

  return (
    <div className="p-4 sm:p-5 space-y-4 h-full flex flex-col">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold mb-0.5" style={{ color: 'var(--bb-text)' }}>Central de Células de Transmissão (Sites 5G)</h1>
        <p className="text-sm" style={{ color: 'var(--bb-text-muted)' }}>Visão descentralizada por cidades · Clique em um site para ver detalhes</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
        {summaryStats.map((s) => (
          <div
            key={s.label}
            onClick={() => handleStatClick(s.filter)}
            className="rounded-xl p-3 text-center transition-all"
            style={{
              backgroundColor: s.bg,
              border: `1px solid ${activeFilter === s.filter && s.filter ? s.color : s.border}`,
              cursor: s.filter ? 'pointer' : 'default',
              transform: activeFilter === s.filter && s.filter ? 'scale(1.03)' : undefined,
              boxShadow: activeFilter === s.filter && s.filter ? `0 0 12px ${s.color}30` : undefined,
            }}
          >
            <div className="text-xl font-black" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs mt-0.5 leading-tight" style={{ color: 'var(--bb-text-dim)' }}>{s.label}</div>
            {s.filter && (
              <div className="text-xs mt-1" style={{ color: s.color, opacity: 0.7 }}>ver lista ↗</div>
            )}
          </div>
        ))}
      </div>

      {/* Main layout */}
      <div className="flex gap-4 flex-1 min-h-0">
        {/* Left column */}
        <div className="flex flex-col gap-4 w-full" style={{ minWidth: 0, flex: showRightPanel ? '0 0 55%' : '1' }}>
          {/* Map */}
          <div className="rounded-xl overflow-hidden flex-1 flex flex-col" style={{ backgroundColor: 'var(--bb-surface)', border: '1px solid var(--bb-border)', minHeight: '340px' }}>
            <div className="flex items-center justify-between px-4 py-2.5 border-b flex-shrink-0" style={{ borderColor: 'var(--bb-border)' }}>
              <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--bb-text)' }}>Topologia Sítio RF por Cidades</span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono" style={{ color: 'var(--bb-cyan)' }}>{zoom.toFixed(1)}×</span>
                <button
                  onClick={() => doZoom(0.5)}
                  className="w-6 h-6 rounded flex items-center justify-center transition-all hover:opacity-80"
                  style={{ backgroundColor: 'var(--bb-surface-raised)', color: 'var(--bb-text-muted)' }}
                  title="Aproximar"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => doZoom(-0.5)}
                  className="w-6 h-6 rounded flex items-center justify-center transition-all hover:opacity-80"
                  style={{ backgroundColor: 'var(--bb-surface-raised)', color: 'var(--bb-text-muted)' }}
                  title="Afastar"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
                  className="w-6 h-6 rounded flex items-center justify-center transition-all hover:opacity-80"
                  style={{ backgroundColor: 'var(--bb-surface-raised)', color: 'var(--bb-text-muted)' }}
                  title="Resetar zoom e posição"
                >
                  <Maximize2 className="w-3 h-3" />
                </button>
              </div>
            </div>
            <div
              ref={mapContainerRef}
              className="relative flex-1 select-none"
              style={{
                backgroundColor: 'var(--bb-surface-raised)',
                minHeight: 0,
                cursor: dragging ? 'grabbing' : zoom > 1 ? 'grab' : 'default',
              }}
              onWheel={(e) => { e.preventDefault(); doZoom(e.deltaY < 0 ? 0.25 : -0.25); }}
              onMouseDown={handleMapMouseDown}
              onMouseMove={handleMapMouseMove}
              onMouseUp={handleMapMouseUp}
              onMouseLeave={handleMapMouseUp}
            >
              <svg className="w-full h-full" viewBox={mapVB} preserveAspectRatio="xMidYMid meet">
                <defs>
                  <pattern id="mapgrid" width="30" height="30" patternUnits="userSpaceOnUse">
                    <path d="M 30 0 L 0 0 0 30" fill="none" stroke="var(--bb-border)" strokeWidth="0.4" />
                  </pattern>
                </defs>
                <rect x={vx} y={vy} width={vw} height={vh} fill="var(--bb-surface-raised)" />
                <rect x={0} y={0} width={BASE_W} height={BASE_H} fill="url(#mapgrid)" />
                {sitesData.map((site) => {
                  const x = ((site.lng + 43) / 10) * 560;
                  const y = ((site.lat + 13.5) / 11) * 380;
                  const cx = Math.max(20, Math.min(540, x));
                  const cy = Math.max(20, Math.min(360, y));
                  const color = getStatusColor(site.status);
                  const isSelected = selectedSite?.id === site.id;
                  const tSize = Math.max(0.7, 1 / Math.sqrt(zoom));
                  return (
                    <g key={site.id} onClick={() => setSelectedSite(site)}>
                      <TowerIcon cx={cx} cy={cy} color={color} size={tSize} isSelected={isSelected} />
                      <text
                        x={cx} y={cy + 22 * tSize}
                        fill={color}
                        fontSize={9 / zoom * 1.1}
                        textAnchor="middle"
                        fontWeight={isSelected ? 'bold' : 'normal'}
                      >
                        {site.city}
                      </text>
                    </g>
                  );
                })}
              </svg>
              <div className="absolute bottom-2 left-2 text-xs px-2 py-1 rounded pointer-events-none" style={{ backgroundColor: 'var(--bb-surface)', color: 'var(--bb-text-dim)', border: '1px solid var(--bb-border)' }}>
                {zoom > 1 ? 'Arraste para mover · scroll para zoom' : 'Clique em uma torre · scroll para zoom'}
              </div>
            </div>
          </div>

          {/* Incident table — oculta quando painel está aberto para o mapa aproveitar toda a altura */}
          {incidents.length > 0 && !showRightPanel && (
            <div className="rounded-xl overflow-hidden" style={{ backgroundColor: 'var(--bb-surface)', border: '1px solid rgba(249,115,22,0.3)' }}>
              <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor: 'rgba(249,115,22,0.2)', backgroundColor: 'rgba(249,115,22,0.05)' }}>
                <AlertTriangle className="w-4 h-4" style={{ color: '#f97316' }} />
                <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#f97316' }}>
                  Incidentes de Falta de Energia AC Detectados
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[420px]">
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--bb-border)' }}>
                      {['ID ANTENA', 'CIDADE HUB', 'DIAGNÓSTICO DE CAMPO', ''].map((h) => (
                        <th key={h} className="text-left text-xs uppercase py-2.5 px-4" style={{ color: 'var(--bb-text-dim)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {incidents.map((inc) => (
                      <tr
                        key={inc.id}
                        className="cursor-pointer transition-colors"
                        style={{
                          borderBottom: '1px solid var(--bb-border-subtle)',
                          backgroundColor: selectedSite?.id === inc.id ? 'rgba(0,217,255,0.05)' : undefined,
                        }}
                        onClick={() => setSelectedSite(inc)}
                      >
                        <td className="py-3 px-4">
                          <span className="text-sm font-bold font-mono" style={{ color: inc.status === 'critical' ? '#ef4444' : '#f97316' }}>
                            {inc.code}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm font-medium" style={{ color: 'var(--bb-text)' }}>{inc.city} - {inc.state}</td>
                        <td className="py-3 px-4 text-xs" style={{ color: 'var(--bb-text-muted)' }}>
                          {inc.energy.batteryStatus === 'critical'
                            ? `Banco de Baterias Crítico · Falta de AC · ${inc.energy.batteryPercent}%`
                            : `Falha Concessionária · Queda de AC · Autonomia ${(inc.energy.autonomyCategory - inc.energy.autonomyUsedHours).toFixed(1)}h`}
                        </td>
                        <td className="py-3 px-4">
                          <ChevronRight className="w-4 h-4" style={{ color: 'var(--bb-text-dim)' }} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Right panel */}
        {showRightPanel ? (
          <div
            className="rounded-xl overflow-hidden flex-shrink-0 flex flex-col"
            style={{
              width: '380px',
              backgroundColor: 'var(--bb-surface)',
              border: '1px solid var(--bb-border)',
              height: '100%',
            }}
          >
            {selectedSite ? (
              <SiteDetail site={selectedSite} onClose={() => setSelectedSite(null)} />
            ) : activeFilter ? (
              <FilteredList
                filter={activeFilter}
                sites={filteredSites[activeFilter]}
                onSelect={handleSelectSite}
                onClose={() => setActiveFilter(null)}
              />
            ) : null}
          </div>
        ) : (
          <div
            className="rounded-xl flex-shrink-0 hidden lg:flex flex-col items-center justify-center gap-3 text-center p-8"
            style={{ width: '340px', backgroundColor: 'var(--bb-surface)', border: '1px dashed var(--bb-border)' }}
          >
            <MapPin className="w-8 h-8 opacity-30" style={{ color: 'var(--bb-text-dim)' }} />
            <p className="text-sm" style={{ color: 'var(--bb-text-dim)' }}>Selecione um site no mapa, na lista de incidentes ou clique em um indicador acima para ver os detalhes</p>
          </div>
        )}
      </div>
    </div>
  );
}
