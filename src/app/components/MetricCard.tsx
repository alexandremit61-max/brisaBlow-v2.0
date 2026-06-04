type MetricCardProps = {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color?: 'cyan' | 'green' | 'orange' | 'red' | 'purple';
  sparklineData?: number[];
};

const colorMap = {
  cyan: { accent: '#00d9ff', bg: 'rgba(0,217,255,0.08)', border: 'rgba(0,217,255,0.2)' },
  green: { accent: '#22c55e', bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.2)' },
  orange: { accent: '#f97316', bg: 'rgba(249,115,22,0.08)', border: 'rgba(249,115,22,0.2)' },
  red: { accent: '#ef4444', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.2)' },
  purple: { accent: '#a855f7', bg: 'rgba(168,85,247,0.08)', border: 'rgba(168,85,247,0.2)' },
};

export default function MetricCard({
  title,
  value,
  subtitle,
  trend,
  trendValue,
  color = 'cyan',
  sparklineData = [30, 40, 35, 50, 45, 60, 55, 70, 65, 80],
}: MetricCardProps) {
  const colors = colorMap[color];
  const trendColor = trend === 'up' ? '#22c55e' : trend === 'down' ? '#ef4444' : 'var(--bb-text-dim)';

  return (
    <div
      className="rounded-xl p-4 flex flex-col gap-3 min-w-0"
      style={{
        backgroundColor: 'var(--bb-surface)',
        border: `1px solid ${colors.border}`,
        boxShadow: `0 1px 3px rgba(0,0,0,0.1), inset 0 1px 0 ${colors.bg}`,
      }}
    >
      {/* Header */}
      <div className="min-w-0">
        <div className="text-xs uppercase tracking-wider truncate mb-1" style={{ color: 'var(--bb-text-dim)' }}>
          {title}
        </div>
        <div
          className="text-2xl font-bold truncate leading-tight"
          style={{ color: colors.accent }}
          title={String(value)}
        >
          {value}
        </div>
        {subtitle && (
          <div className="text-xs mt-1 truncate" style={{ color: 'var(--bb-text-dim)' }}>
            {subtitle}
          </div>
        )}
      </div>

      {/* Sparkline */}
      <div className="h-10 flex items-end gap-0.5">
        {sparklineData.map((height, idx) => (
          <div
            key={idx}
            className="flex-1 rounded-t"
            style={{
              height: `${height}%`,
              backgroundColor: colors.accent,
              opacity: 0.2 + (height / 100) * 0.6,
            }}
          />
        ))}
      </div>

      {/* Trend */}
      {trendValue && (
        <div className="text-xs font-medium" style={{ color: trendColor }}>
          {trend === 'up' ? '▲' : trend === 'down' ? '▼' : '●'} {trendValue}
        </div>
      )}
    </div>
  );
}
