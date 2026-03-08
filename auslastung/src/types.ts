export interface WeekColumn {
  key: string;        // "24.02.2025"
  label: string;      // "Feb W4"
  date: Date;
  fullHeader: string; // "24.02.2025\nFeb W4"
}

export interface WeekData {
  percent: number;
  hours: number;
}

export interface EngagementEntry {
  team: string;
  engagementId: string;
  engagementName: string;
  employee: string;
  notes: string;
  weekData: Map<string, WeekData>;
}

export interface EngagementGroup {
  engagementId: string;
  engagementName: string;
  entries: EngagementEntry[];
}

export interface TeamGroup {
  team: string;
  engagements: EngagementGroup[];
}

export interface ParsedData {
  weeks: WeekColumn[];
  entries: EngagementEntry[];
  teams: TeamGroup[];
}
