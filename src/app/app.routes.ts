import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/shell.component').then(m => m.ShellComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'record' },
      { path: 'record', loadComponent: () => import('./features/record/record.page').then(m => m.RecordPage) },
      { path: 'timeline', loadComponent: () => import('./features/timeline/timeline.page').then(m => m.TimelinePage) },
      { path: 'calendar', loadComponent: () => import('./features/calendar/calendar.page').then(m => m.CalendarPage) },
      { path: 'sensors', loadComponent: () => import('./features/sensors/sensors.page').then(m => m.SensorsPage) },
      { path: 'transcription', loadComponent: () => import('./features/transcription/transcription.page').then(m => m.TranscriptionPage) },
      { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard.page').then(m => m.DashboardPage) },
      { path: 'diagram', loadComponent: () => import('./features/diagram/diagram.page').then(m => m.DiagramPage) }
    ]
  },
  { path: 'login', loadComponent: () => import('./features/auth/login.page').then(m => m.LoginPage) },
  { path: '**', redirectTo: '' }
];


