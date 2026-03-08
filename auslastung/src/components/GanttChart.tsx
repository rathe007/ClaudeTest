import type { TeamGroup, WeekColumn } from '../types';
import { GanttHeader } from './GanttHeader';
import { TeamRow } from './TeamRow';

interface GanttChartProps {
  teams: TeamGroup[];
  weeks: WeekColumn[];
}

export function GanttChart({ teams, weeks }: GanttChartProps) {
  return (
    <div className="gantt-outer">
      <div className="gantt-scroll">
        <GanttHeader weeks={weeks} />
        {teams.map((team, idx) => (
          <TeamRow key={idx} group={team} weeks={weeks} />
        ))}
      </div>
    </div>
  );
}
