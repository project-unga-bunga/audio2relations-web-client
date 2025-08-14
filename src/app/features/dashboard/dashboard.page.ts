import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MiniChartComponent } from './mini-chart.component';
import { TimelineService } from '../../services/timeline.service';
import { VersionDisplayComponent } from '../../components/version-display.component';

@Component({
  standalone: true,
  selector: 'app-dashboard-page',
  imports: [CommonModule, MiniChartComponent, VersionDisplayComponent],
  template: `
    <h2>Dashboard</h2>
    <div class="cards">
      <div class="card">
        <div class="title">Total Events</div>
        <div class="value">{{ total() }}</div>
      </div>
      <div class="card">
        <div class="title">Audio Clips</div>
        <div class="value">{{ audioCount() }}</div>
      </div>
    </div>
    <div class="chart">
      <app-mini-chart [data]="histogram()"></app-mini-chart>
    </div>
    <div class="version-info">
      <app-version-display displayMode="compact"></app-version-display>
    </div>
  `,
  styles: [`
    .cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px}
    .card{border:1px solid #eee;border-radius:8px;padding:12px}
    .title{color:#666}
    .value{font-size:24px;font-weight:700}
    .version-info{text-align:center;margin-top:20px;padding:10px;border-top:1px solid #eee}
  `]
})
export class DashboardPage {
  private timeline = inject(TimelineService);
  total = computed(() => this.timeline.events().length);
  audioCount = computed(() => this.timeline.events().filter(e => e.type==='audio').length);
  histogram = computed(() => {
    const buckets: Record<string, number> = {};
    for (const e of this.timeline.events()) {
      const day = new Date(e.timestamp).toISOString().slice(0,10);
      buckets[day] = (buckets[day] ?? 0) + 1;
    }
    return Object.entries(buckets).map(([label, value]) => ({ label, value }));
  });
}


