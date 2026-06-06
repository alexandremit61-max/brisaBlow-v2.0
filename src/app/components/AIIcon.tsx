// ═══════════════════════════════════════════════════════════════════════════
// MUDANÇA: Emoji de robô 🤖 - simples, limpo e universal
// Mais direto e reconhecível que SVG customizado
// ═══════════════════════════════════════════════════════════════════════════

type AIIconProps = {
  className?: string;
  animate?: boolean;
};

export default function AIIcon({ className = "w-4 h-4", animate = true }: AIIconProps) {
  return (
    <span
      className={`inline-flex items-center justify-center ${className} ${animate ? 'ai-icon-pulse' : ''}`}
      style={{ fontSize: 'inherit' }}
    >
      🤖
      <style>{`
        @keyframes ai-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.85; transform: scale(1.05); }
        }

        .ai-icon-pulse {
          animation: ai-pulse 3s ease-in-out infinite;
        }
      `}</style>
    </span>
  );
}
