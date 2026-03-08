import { useState } from 'react';
import { ChevronRight, ChevronDown, Users } from 'lucide-react';
import type { TeamGroup, WeekColumn } from '../types';
import { EngagementRow } from './EngagementRow';

interface TeamRowProps {
  group: TeamGroup;
  weeks: WeekColumn[];
}

export function TeamRow({ group, weeks }: TeamRowProps) {
  const [expanded, setExpanded] = useState(true);
  const allEntries = group.engagements.flatMap(e => e.entries);
  const displayName = group.team || '(Kein Team)';

  return (
    <div className="team-card">
      <div className="team-card-header" onClick={() => setExpanded(!expanded)}>
        <div className="team-card-title">
          {expanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          <span className="team-name">{displayName}</span>
        </div>
        <div className="team-card-meta">
          <Users size={14} />
          <span>{allEntries.length} Mitarbeiter</span>
          <span className="team-eng-count">{group.engagements.length} Engagements</span>
        </div>
      </div>
      {expanded && (
        <div className="team-card-body">
          {group.engagements.map((eng, idx) => (
            <EngagementRow key={idx} group={eng} weeks={weeks} />
          ))}
        </div>
      )}
    </div>
  );
}
