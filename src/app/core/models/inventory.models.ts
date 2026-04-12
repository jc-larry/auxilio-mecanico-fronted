// ── Inventory Models ──

export type SystemCategory =
  | 'hidraulica'
  | 'electrico'
  | 'motor'
  | 'combustion'
  | 'lubricacion'
  | 'frenos'
  | 'neumaticos'
  | 'transmision'
  | 'carroceria'
  | 'general';

export interface InventoryItem {
  id: number;
  sku: string;
  name: string;
  system_category: SystemCategory;
  system_label: string;
  icon: string;
  quantity: number;
  min_stock: number;
  unit_price: number;
  is_critical: boolean;
  created_at: string;
  updated_at: string;
  user_id: number;
}

export interface InventoryItemCreate {
  name: string;
  sku: string;
  system_category: SystemCategory;
  quantity: number;
  min_stock: number;
  unit_price: number;
}

export interface InventoryItemUpdate {
  name?: string;
  system_category?: SystemCategory;
  quantity?: number;
  min_stock?: number;
  unit_price?: number;
}

export interface RestockRequest {
  quantity: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
}

export interface InventoryStats {
  total_items: number;
  total_units: number;
  critical_count: number;
  total_value: number;
}

// ── Options ──

export const SYSTEM_CATEGORY_OPTIONS: { value: SystemCategory; label: string }[] = [
  { value: 'hidraulica', label: 'Sistema Hidráulico' },
  { value: 'electrico', label: 'Sistema Eléctrico' },
  { value: 'motor', label: 'Motor' },
  { value: 'combustion', label: 'Combustión Interna' },
  { value: 'lubricacion', label: 'Lubricación' },
  { value: 'frenos', label: 'Sistema de Frenos' },
  { value: 'neumaticos', label: 'Neumáticos' },
  { value: 'transmision', label: 'Transmisión' },
  { value: 'carroceria', label: 'Carrocería' },
  { value: 'general', label: 'General' },
];
