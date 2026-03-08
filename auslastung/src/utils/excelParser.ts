import * as XLSX from 'xlsx';
import type { WeekColumn, EngagementEntry, TeamGroup, EngagementGroup, ParsedData } from '../types';

const FIXED_COLUMNS = 5; // Team, Engagement ID, Engagement Name, Mitarbeiter, Notizen

function parseWeekHeaders(headerRow: unknown[]): WeekColumn[] {
  const weeks: WeekColumn[] = [];
  for (let i = FIXED_COLUMNS; i < headerRow.length; i++) {
    const raw = String(headerRow[i] ?? '');
    if (!raw.trim()) continue;

    // Split on \r\n or \n
    const parts = raw.split(/\r?\n/);
    const dateStr = parts[0]?.trim() ?? '';
    const label = parts[1]?.trim() ?? '';

    // Parse date "24.02.2025" → Date
    const dateParts = dateStr.split('.');
    let date = new Date();
    if (dateParts.length === 3) {
      date = new Date(
        parseInt(dateParts[2], 10),
        parseInt(dateParts[1], 10) - 1,
        parseInt(dateParts[0], 10)
      );
    }

    weeks.push({ key: dateStr, label, date, fullHeader: raw });
  }
  return weeks;
}

function parseSheet(sheet: XLSX.WorkSheet): unknown[][] {
  return XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' }) as unknown[][];
}

export function parseExcel(buffer: ArrayBuffer): ParsedData {
  const workbook = XLSX.read(buffer, { type: 'array' });

  const percentSheet = workbook.Sheets['Auslastung_Prozent'];
  const hoursSheet = workbook.Sheets['Auslastung_Stunden'];

  if (!percentSheet) {
    throw new Error('Sheet "Auslastung_Prozent" nicht gefunden');
  }
  if (!hoursSheet) {
    throw new Error('Sheet "Auslastung_Stunden" nicht gefunden');
  }

  const percentRows = parseSheet(percentSheet);
  const hoursRows = parseSheet(hoursSheet);

  if (percentRows.length === 0) {
    throw new Error('Keine Daten im Prozent-Sheet gefunden');
  }

  // Parse week headers from first row
  const weeks = parseWeekHeaders(percentRows[0]);

  // Parse data rows (skip header)
  const entries: EngagementEntry[] = [];

  for (let i = 1; i < percentRows.length; i++) {
    const pRow = percentRows[i];
    const hRow = hoursRows[i] ?? [];

    const team = String(pRow[0] ?? '').trim();
    const engagementId = String(pRow[1] ?? '').trim();
    const engagementName = String(pRow[2] ?? '').trim();
    const employee = String(pRow[3] ?? '').trim();
    const notes = String(pRow[4] ?? '').trim();

    // Skip empty rows
    if (!team && !employee && !engagementName) continue;

    const weekData = new Map<string, { percent: number; hours: number }>();
    for (let w = 0; w < weeks.length; w++) {
      const colIdx = FIXED_COLUMNS + w;
      const rawPercent = pRow[colIdx];
      const rawHours = hRow[colIdx];

      const percent = typeof rawPercent === 'number' ? rawPercent : parseFloat(String(rawPercent)) || 0;
      const hours = typeof rawHours === 'number' ? rawHours : parseFloat(String(rawHours)) || 0;

      weekData.set(weeks[w].key, { percent, hours });
    }

    entries.push({ team, engagementId, engagementName, employee, notes, weekData });
  }

  // Build hierarchy: Team → Engagement → Entries
  const teams = buildHierarchy(entries);

  return { weeks, entries, teams };
}

function buildHierarchy(entries: EngagementEntry[]): TeamGroup[] {
  const teamMap = new Map<string, Map<string, EngagementEntry[]>>();

  for (const entry of entries) {
    if (!teamMap.has(entry.team)) {
      teamMap.set(entry.team, new Map());
    }
    const engMap = teamMap.get(entry.team)!;
    const engKey = entry.engagementId || entry.engagementName;
    if (!engMap.has(engKey)) {
      engMap.set(engKey, []);
    }
    engMap.get(engKey)!.push(entry);
  }

  const teams: TeamGroup[] = [];
  for (const [team, engMap] of teamMap) {
    const engagements: EngagementGroup[] = [];
    for (const [, entries] of engMap) {
      engagements.push({
        engagementId: entries[0].engagementId,
        engagementName: entries[0].engagementName,
        entries,
      });
    }
    teams.push({ team, engagements });
  }

  return teams;
}
