import { useMemo } from 'react';
import { Search } from 'lucide-react';
import type { EngagementEntry } from '../types';

interface FilterBarProps {
  entries: EngagementEntry[];
  teamFilter: string;
  employeeFilter: string;
  engagementFilter: string;
  searchQuery: string;
  onTeamChange: (v: string) => void;
  onEmployeeChange: (v: string) => void;
  onEngagementChange: (v: string) => void;
  onSearchChange: (v: string) => void;
}

export function FilterBar({
  entries, teamFilter, employeeFilter, engagementFilter, searchQuery,
  onTeamChange, onEmployeeChange, onEngagementChange, onSearchChange,
}: FilterBarProps) {
  const teams = useMemo(() => [...new Set(entries.map(e => e.team).filter(Boolean))].sort(), [entries]);
  const employees = useMemo(() => [...new Set(entries.map(e => e.employee).filter(Boolean))].sort(), [entries]);
  const engagements = useMemo(() => {
    const map = new Map<string, string>();
    for (const e of entries) {
      if (e.engagementId || e.engagementName) {
        map.set(e.engagementId || e.engagementName, e.engagementName || e.engagementId);
      }
    }
    return [...map.entries()].sort((a, b) => a[1].localeCompare(b[1]));
  }, [entries]);

  return (
    <div className="filter-bar">
      <div className="filter-group">
        <label>Team</label>
        <select value={teamFilter} onChange={e => onTeamChange(e.target.value)}>
          <option value="">Alle Teams</option>
          {teams.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <div className="filter-group">
        <label>Mitarbeiter</label>
        <select value={employeeFilter} onChange={e => onEmployeeChange(e.target.value)}>
          <option value="">Alle Mitarbeiter</option>
          {employees.map(e => <option key={e} value={e}>{e}</option>)}
        </select>
      </div>
      <div className="filter-group">
        <label>Engagement</label>
        <select value={engagementFilter} onChange={e => onEngagementChange(e.target.value)}>
          <option value="">Alle Engagements</option>
          {engagements.map(([key, name]) => <option key={key} value={key}>{name}</option>)}
        </select>
      </div>
      <div className="filter-group search-group">
        <label>Suche</label>
        <div className="search-input-wrapper">
          <Search size={16} />
          <input
            type="text"
            placeholder="Suchen..."
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
