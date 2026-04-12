import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface ServiceRequest {
  name: string;
  service: string;
  urgency: 'high' | 'med' | 'low';
  status: 'PENDING' | 'ACCEPTED' | 'IN PROGRESS';
  location: string;
  detail: string;
  time: string;
  gradient: string;
}

interface Technician {
  initials: string;
  color: string;
  name: string;
  unit: string;
  specialty: string;
  status: 'AVAILABLE' | 'ON-SITE' | 'RETURNING';
  jobs: number;
}

@Component({
  selector: 'app-main-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './main-dashboard.component.html',
})
export class MainDashboardComponent {
  readonly requests: ServiceRequest[] = [
    {
      name: 'Eleanor Vance', service: 'Heavy Towing Required', urgency: 'high', status: 'PENDING',
      location: 'I-95 North, Exit 42 (Shoulder)', detail: '2021 Ford F-150 (Silver)',
      time: '2m ago', gradient: 'linear-gradient(160deg, #1e3a5f 0%, #0d1f35 100%)',
    },
    {
      name: 'Jared Miller', service: 'Tire Change', urgency: 'med', status: 'ACCEPTED',
      location: '242 Oak St, Residential', detail: 'Tech: Sam Rivers (En route)',
      time: '12m ago', gradient: 'linear-gradient(160deg, #2d4a6e 0%, #1a2d44 100%)',
    },
    {
      name: 'Sarah Connor', service: 'Lockout Service', urgency: 'low', status: 'IN PROGRESS',
      location: 'Mall Parking, Section B4', detail: 'Locksmith on site (ETA 2m)',
      time: '28m ago', gradient: 'linear-gradient(160deg, #3a3a4e 0%, #22222e 100%)',
    },
  ];

  readonly technicians: Technician[] = [
    { initials: 'DM', color: '#091426', name: 'David Miller', unit: 'Units: Truck 04', specialty: 'Heavy Lift', status: 'AVAILABLE', jobs: 5 },
    { initials: 'RS', color: '#9d4300', name: 'Riley Smith', unit: 'Units: Van 12', specialty: 'Diagnostics', status: 'ON-SITE', jobs: 3 },
    { initials: 'KA', color: '#3c475a', name: 'Kenji Akimoto', unit: 'Units: Truck 01', specialty: 'Wrecker', status: 'RETURNING', jobs: 6 },
  ];

  readonly inventoryAlerts = [
    { name: 'Battery Stock', status: 'Critically Low', pct: '15%', critical: true, note: 'Order 50x Heavy Duty units immediately.' },
    { name: 'Hydraulic Fluid', status: 'Stable', pct: '72%', critical: false, note: 'Next restock scheduled: Thursday.' },
  ];
}
