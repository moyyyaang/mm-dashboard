export interface DailyInput {
  id: string;
  employeeName: string;
  date: string;
  planning: number;
  shooting: number;
  editing: number;
  other: number;
  memo: string;
  createdAt: string;
}

export interface Employee {
  id: string;
  name: string;
  team: string;
  position: string;
}

export interface TeamStats {
  teamName: string;
  totalMembers: number;
  completedInputs: number;
  totalInputs: number;
  completionRate: number;
}

export interface DashboardStats {
  totalEmployees: number;
  totalInputs: number;
  missingInputs: number;
  monthlyProgress: number;
  teamStats: TeamStats[];
}

export interface ChartData {
  name: string;
  value: number;
  color?: string;
}

export interface TimeSeriesData {
  date: string;
  planning: number;
  shooting: number;
  editing: number;
  other: number;
  total: number;
}
