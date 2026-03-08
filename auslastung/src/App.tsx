import { useState, useMemo, useCallback } from 'react';
import { FileUpload } from './components/FileUpload';
import { FilterBar } from './components/FilterBar';
import { GanttChart } from './components/GanttChart';
import { AuthForm } from './components/AuthForm';
import { UserMenu } from './components/UserMenu';
import { useAuth } from './hooks/useAuth';
import { parseExcel } from './utils/excelParser';
import type { ParsedData, TeamGroup, EngagementGroup } from './types';
import './styles/gantt.css';

function App() {
  const { user, loading, signOut } = useAuth();
  const [data, setData] = useState<ParsedData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [teamFilter, setTeamFilter] = useState('');
  const [employeeFilter, setEmployeeFilter] = useState('');
  const [engagementFilter, setEngagementFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleFileLoaded = useCallback((buffer: ArrayBuffer) => {
    try {
      setError(null);
      const parsed = parseExcel(buffer);
      setData(parsed);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Fehler beim Einlesen der Datei');
    }
  }, []);

  const filteredTeams = useMemo(() => {
    if (!data) return [];

    let entries = data.entries;

    if (teamFilter) {
      entries = entries.filter(e => e.team === teamFilter);
    }
    if (employeeFilter) {
      entries = entries.filter(e => e.employee === employeeFilter);
    }
    if (engagementFilter) {
      entries = entries.filter(e =>
        e.engagementId === engagementFilter || e.engagementName === engagementFilter
      );
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      entries = entries.filter(e =>
        e.team.toLowerCase().includes(q) ||
        e.employee.toLowerCase().includes(q) ||
        e.engagementName.toLowerCase().includes(q) ||
        e.engagementId.toLowerCase().includes(q) ||
        e.notes.toLowerCase().includes(q)
      );
    }

    // Rebuild hierarchy from filtered entries
    const teamMap = new Map<string, Map<string, typeof entries>>();
    for (const entry of entries) {
      if (!teamMap.has(entry.team)) teamMap.set(entry.team, new Map());
      const engMap = teamMap.get(entry.team)!;
      const engKey = entry.engagementId || entry.engagementName;
      if (!engMap.has(engKey)) engMap.set(engKey, []);
      engMap.get(engKey)!.push(entry);
    }

    const teams: TeamGroup[] = [];
    for (const [team, engMap] of teamMap) {
      const engagements: EngagementGroup[] = [];
      for (const [, groupEntries] of engMap) {
        engagements.push({
          engagementId: groupEntries[0].engagementId,
          engagementName: groupEntries[0].engagementName,
          entries: groupEntries,
        });
      }
      teams.push({ team, engagements });
    }
    return teams;
  }, [data, teamFilter, employeeFilter, engagementFilter, searchQuery]);

  if (loading) {
    return <div style={{ minHeight: '100vh', background: '#F6F6FA' }} />;
  }

  if (!user) {
    return <AuthForm />;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F6F6FA' }}>
      <div style={{ background: '#2E2E38', padding: '16px 24px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ background: '#FFE600', padding: '6px 12px' }}>
          <span style={{ fontSize: '20px', fontWeight: 800, color: '#2E2E38', letterSpacing: '0.02em' }}>EY</span>
        </div>
        <h1 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', margin: 0, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          Auslastungs-Übersicht
        </h1>
        <UserMenu user={user} onSignOut={signOut} />
      </div>
      <div style={{ padding: '0 24px' }}>

      {error && <div className="error-message">{error}</div>}

      {!data ? (
        <FileUpload onFileLoaded={handleFileLoaded} />
      ) : (
        <>
          <FilterBar
            entries={data.entries}
            teamFilter={teamFilter}
            employeeFilter={employeeFilter}
            engagementFilter={engagementFilter}
            searchQuery={searchQuery}
            onTeamChange={setTeamFilter}
            onEmployeeChange={setEmployeeFilter}
            onEngagementChange={setEngagementFilter}
            onSearchChange={setSearchQuery}
          />
          <GanttChart teams={filteredTeams} weeks={data.weeks} />
        </>
      )}
      </div>
    </div>
  );
}

export default App;
