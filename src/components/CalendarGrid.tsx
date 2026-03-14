"use client";

interface DayData {
  date: number;
  emotion: number;
  hasResonance: boolean;
}

interface CalendarGridProps {
  year: number;
  month: number;
  days: DayData[];
}

function emotionToColor(emotion: number): string {
  const t = emotion / 100;
  const r = Math.round(59 + (249 - 59) * t);
  const g = Math.round(91 + (115 - 91) * t);
  const b = Math.round(219 + (22 - 219) * t);
  return `rgb(${r}, ${g}, ${b})`;
}

export default function CalendarGrid({ year, month, days }: CalendarGridProps) {
  const dayMap = new Map(days.map((d) => [d.date, d]));
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay();

  const cells: (number | null)[] = [
    ...Array(firstDayOfWeek).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="w-full">
      {/* 曜日ヘッダー */}
      <div className="grid grid-cols-7 mb-2">
        {["日", "月", "火", "水", "木", "金", "土"].map((d) => (
          <div key={d} className="text-center text-xs text-white/20 py-1">
            {d}
          </div>
        ))}
      </div>

      {/* 日付グリッド */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, idx) => {
          if (day === null) return <div key={`empty-${idx}`} />;

          const data = dayMap.get(day);
          const color = data ? emotionToColor(data.emotion) : null;

          return (
            <div
              key={day}
              className="relative aspect-square rounded flex items-center justify-center"
              style={{
                background: color ? `${color}22` : "rgba(255,255,255,0.03)",
                border: color
                  ? `1px solid ${color}44`
                  : "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <span
                className="text-xs"
                style={{ color: color ?? "rgba(255,255,255,0.2)" }}
              >
                {day}
              </span>

              {data?.hasResonance && (
                <svg
                  className="absolute bottom-0.5 right-0.5"
                  width="8"
                  height="8"
                  viewBox="0 0 8 8"
                >
                  <circle
                    cx="4"
                    cy="4"
                    r="3"
                    fill="none"
                    stroke="rgba(251,191,36,0.6)"
                    strokeWidth="1"
                  />
                  <circle cx="4" cy="4" r="1.5" fill="rgba(251,191,36,0.4)" />
                </svg>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
