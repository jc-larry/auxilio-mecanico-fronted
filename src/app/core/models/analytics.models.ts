// ── Analytics Models ──

export interface RequestByDay {
  day: string;
  value: number;
  date: string;
  height_pct: number;
  is_peak: boolean;
}

export interface RequestByType {
  type: string;
  label: string;
  count: number;
  pct: number;
  color: string;
}

export interface RequestByStatus {
  status: string;
  label: string;
  count: number;
  color: string;
}

export interface MechanicWorkload {
  name: string;
  initials: string;
  assigned_count: number;
}

export interface InventoryBySystem {
  category: string;
  label: string;
  total_units: number;
  item_count: number;
}

export interface AnalyticsSummary {
  total_requests: number;
  active_requests: number;
  completed_requests: number;
  total_mechanics: number;
  available_mechanics: number;
  total_parts: number;
  critical_parts: number;
  inventory_value: number;
}

export interface DashboardAnalytics {
  requests_by_day: RequestByDay[];
  requests_by_type: RequestByType[];
  requests_by_status: RequestByStatus[];
  mechanic_workload: MechanicWorkload[];
  inventory_by_system: InventoryBySystem[];
  summary: AnalyticsSummary;
}
