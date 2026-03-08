import { useMemo } from 'react';
import type { WeekColumn } from '../types';

interface GanttHeaderProps {
  weeks: WeekColumn[];
}

interface MonthGroup {
  label: string;
  span: number;
}

function getMonthLabel(date: Date): string {
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAI', 'JUN', 'JUL', 'AUG', 'SEP', 'OKT', 'NOV', 'DEZ'];
  return `${months[date.getMonth()]} ${date.getFullYear()}`;
}

export function GanttHeader({ weeks }: GanttHeaderProps) {
  const monthGroups = useMemo(() => {
    const groups: MonthGroup[] = [];
    let currentLabel = '';
    for (const week of weeks) {
      const label = getMonthLabel(week.date);
      if (label === currentLabel) {
        groups[groups.length - 1].span++;
      } else {
        groups.push({ label, span: 1 });
        currentLabel = label;
      }
    }
    return groups;
  }, [weeks]);

  return (
    <div className="gantt-header-wrap">
      {/* Month row */}
      <div className="gantt-row gantt-header-months">
        <div className="row-label header-label-spacer" />
        <div className="row-cells">
          {monthGroups.map((mg, i) => (
            <div
              key={i}
              className="month-cell"
              style={{ minWidth: mg.span * 72, width: mg.span * 72 }}
            >
              {mg.label}
            </div>
          ))}
        </div>
      </div>
      {/* Week row */}
      <div className="gantt-row gantt-header-weeks">
        <div className="row-label header-label">
          <span className="header-col">Engagement</span>
          <span className="header-col header-col-pct">%</span>
          <span className="header-col">Mitarbeiter</span>
        </div>
        <div className="row-cells">
          {weeks.map(week => (
            <div key={week.key} className="header-cell">
              <span className="header-week-label">{week.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
