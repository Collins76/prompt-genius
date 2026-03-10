"use client";

interface ScoreGaugeProps {
  score: number;
  size?: number;
  label?: string;
}

export default function ScoreGauge({ score, size = 120, label }: ScoreGaugeProps) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getColor = (s: number) => {
    if (s >= 80) return "var(--success)";
    if (s >= 60) return "#10b981";
    if (s >= 40) return "var(--warning)";
    return "var(--danger)";
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--bg-tertiary)"
          strokeWidth="8"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor(score)}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="score-ring"
        />
      </svg>
      <div className="absolute flex flex-col items-center" style={{ marginTop: size / 2 - 18 }}>
        <span className="text-2xl font-bold" style={{ color: getColor(score) }}>
          {score}
        </span>
      </div>
      {label && (
        <span className="text-xs text-[var(--text-secondary)] mt-1">{label}</span>
      )}
    </div>
  );
}
