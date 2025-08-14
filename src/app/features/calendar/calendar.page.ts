import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimelineService } from '../../services/timeline.service';

function startOfDay(ts: number): number { const d = new Date(ts); d.setHours(0,0,0,0); return d.getTime(); }

@Component({
  standalone: true,
  selector: 'app-calendar-page',
  imports: [CommonModule],
  template: `
    <h2>Calendar</h2>
    <div class="calendar-nav">
      <button (click)="prevDay()">Prev</button>
      <div>{{ selectedDay() | date: 'fullDate' }}</div>
      <button (click)="nextDay()">Next</button>
    </div>
    <ul>
      <li *ngFor="let e of dayEvents()">{{ e.timestamp | date:'shortTime' }} - {{ e.type }}</li>
    </ul>
  `,
  styles: [`
    .calendar-nav{display:flex;gap:12px;align-items:center;margin-bottom:12px}
  `]
})
export class CalendarPage {
  private timeline = inject(TimelineService);
  selectedDay = signal(startOfDay(Date.now()));
  dayEvents = computed(() => this.timeline.events().filter(e => startOfDay(e.timestamp) === this.selectedDay()));

  prevDay() { this.selectedDay.set(this.selectedDay() - 24*60*60*1000); }
  nextDay() { this.selectedDay.set(this.selectedDay() + 24*60*60*1000); }
}


