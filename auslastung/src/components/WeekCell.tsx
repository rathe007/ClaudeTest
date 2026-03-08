import { useState } from 'react';
import type { WeekData, WeekColumn } from '../types';

interface WeekCellProps {
  data: WeekData | undefined;
  week: WeekColumn;
  employee?: string;
  engagement?: string;
  team?: string;
  notes?: string;
}

function getBarColor(percent: number): string {
  if (percent <= 0) return 'transparent';
  if (percent <= 0.5) return '#FFE600';   // EY yellow
  if (percent <= 0.8) return '#FFD700';   // EY deeper yellow
  if (percent <= 1.0) return '#2E2E38';   // EY dark
  return '#FF4136';                        // Overloaded
}

function getTextColor(percent: number): string {
  if (percent > 0.8) return '#fff';
  return '#2E2E38';
}

function formatPercent(v: number): string {
  return `${Math.round(v * 100)}%`;
}

export function WeekCell({ data, week, employee, engagement, team, notes }: WeekCellProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const percent = data?.percent ?? 0;
  const hours = data?.hours ?? 0;

  return (
    <div
      className="bar-cell"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {percent > 0 && (
        <div
          className="bar-fill"
          style={{
            height: `${Math.min(percent * 100, 100)}%`,
            backgroundColor: getBarColor(percent),
          }}
        >
          <span className="bar-text" style={{ color: getTextColor(percent) }}>
            {formatPercent(percent)}
          </span>
        </div>
      )}
      {showTooltip && percent > 0 && (
        <div className="tooltip">
          {team && <div><strong>Team:</strong> {team}</div>}
          {engagement && <div><strong>Engagement:</strong> {engagement}</div>}
          {employee && <div><strong>Mitarbeiter:</strong> {employee}</div>}
          <div><strong>Woche:</strong> {week.key} ({week.label})</div>
          <div><strong>Auslastung:</strong> {formatPercent(percent)}</div>
          <div><strong>Stunden:</strong> {hours.toFixed(1)}h</div>
          {notes && <div><strong>Notizen:</strong> {notes}</div>}
        </div>
      )}
    </div>
  );
}

// Aggregated cell for team/engagement rows
interface AggregatedWeekCellProps {
  totalPercent: number;
  totalHours: number;
  count: number;
  week: WeekColumn;
  label: string;
}

export function AggregatedWeekCell({ totalPercent, totalHours, count, week, label }: AggregatedWeekCellProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const avgPercent = count > 0 ? totalPercent / count : 0;

  return (
    <div
      className="bar-cell"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {avgPercent > 0 && (
        <div
          className="bar-fill"
          style={{
            height: `${Math.min(avgPercent * 100, 100)}%`,
            backgroundColor: getBarColor(avgPercent),
          }}
        >
          <span className="bar-text" style={{ color: getTextColor(avgPercent) }}>
            {formatPercent(avgPercent)}
          </span>
        </div>
      )}
      {showTooltip && avgPercent > 0 && (
        <div className="tooltip">
          <div><strong>{label}</strong></div>
          <div><strong>Woche:</strong> {week.key} ({week.label})</div>
          <div><strong>Ø Auslastung:</strong> {formatPercent(avgPercent)}</div>
          <div><strong>Σ Stunden:</strong> {totalHours.toFixed(1)}h</div>
          <div><strong>Mitarbeiter:</strong> {count}</div>
        </div>
      )}
    </div>
  );
}
