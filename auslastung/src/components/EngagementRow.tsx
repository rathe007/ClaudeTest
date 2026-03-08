import { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import type { EngagementGroup, WeekColumn } from '../types';
import { EmployeeRow } from './EmployeeRow';

interface EngagementRowProps {
  group: EngagementGroup;
  weeks: WeekColumn[];
}

export function EngagementRow({ group, weeks }: EngagementRowProps) {
  const [expanded, setExpanded] = useState(false);
  const displayName = group.engagementName || group.engagementId || '(Kein Engagement)';

  // Calculate average percent for the engagement
  const avgPercent = (() => {
    let total = 0, count = 0;
    for (const entry of group.entries) {
      for (const [, wd] of entry.weekData) {
        if (wd.percent > 0) { total += wd.percent; count++; }
      }
    }
    return count > 0 ? Math.round((total / count) * 100) : 0;
  })();

  return (
    <>
      <div className="gantt-row engagement-row" onClick={() => setExpanded(!expanded)}>
        <div className="row-label engagement-label">
          <span className="eng-toggle">
            {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </span>
          <span className="eng-name" title={displayName}>{displayName}</span>
          <span className="eng-pct">{avgPercent}%</span>
          <span className="eng-count">{group.entries.length}</span>
        </div>
        <div className="row-cells">
          {weeks.map(week => {
            // Aggregated bar for engagement
            let totalPercent = 0, count = 0;
            for (const entry of group.entries) {
              const d = entry.weekData.get(week.key);
              if (d && d.percent > 0) { totalPercent += d.percent; count++; }
            }
            const avg = count > 0 ? totalPercent / count : 0;
            return (
              <div key={week.key} className="bar-cell">
                {avg > 0 && (
                  <div
                    className="bar-fill"
                    style={{
                      height: `${Math.min(avg * 100, 100)}%`,
                      backgroundColor: getBarColor(avg),
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
      {expanded && group.entries.map((entry, idx) => (
        <EmployeeRow key={idx} entry={entry} weeks={weeks} />
      ))}
    </>
  );
}

function getBarColor(percent: number): string {
  if (percent <= 0) return 'transparent';
  if (percent <= 0.5) return '#FFE600';
  if (percent <= 0.8) return '#FFD700';
  if (percent <= 1.0) return '#2E2E38';
  return '#FF4136';
}
