import type { EngagementEntry, WeekColumn } from '../types';
import { WeekCell } from './WeekCell';

interface EmployeeRowProps {
  entry: EngagementEntry;
  weeks: WeekColumn[];
}

export function EmployeeRow({ entry, weeks }: EmployeeRowProps) {
  // Calculate average percent across weeks with data
  const avgPercent = (() => {
    let total = 0, count = 0;
    for (const [, wd] of entry.weekData) {
      if (wd.percent > 0) { total += wd.percent; count++; }
    }
    return count > 0 ? Math.round((total / count) * 100) : 0;
  })();

  return (
    <div className="gantt-row employee-row">
      <div className="row-label employee-label">
        <span className="emp-avatar">{getInitials(entry.employee)}</span>
        <span className="emp-name" title={entry.employee}>{entry.employee}</span>
        <span className="emp-pct">{avgPercent}%</span>
      </div>
      <div className="row-cells">
        {weeks.map(week => (
          <WeekCell
            key={week.key}
            data={entry.weekData.get(week.key)}
            week={week}
            employee={entry.employee}
            engagement={entry.engagementName}
            team={entry.team}
            notes={entry.notes}
          />
        ))}
      </div>
    </div>
  );
}

function getInitials(name: string): string {
  return name
    .split(/[\s,]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase() ?? '')
    .join('');
}
