import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-mini-chart',
  imports: [CommonModule],
  template: `
    <div class="bar-chart" *ngIf="data?.length">
      <div class="bar" *ngFor="let d of data" [style.height.%]="normalize(d.value)" [title]="d.label + ': ' + d.value"></div>
    </div>
    <div *ngIf="!data || data.length===0">No data</div>
  `,
  styles: [`
    .bar-chart{display:flex;gap:4px;align-items:flex-end;height:120px;border:1px solid #eee;border-radius:8px;padding:8px}
    .bar{flex:1;background:#27ae60;border-radius:4px}
  `]
})
export class MiniChartComponent {
  @Input() data: { label: string; value: number }[] = [];
  normalize(value: number): number { const max = Math.max(1, ...this.data.map(d => d.value)); return (value / max) * 100; }
}


