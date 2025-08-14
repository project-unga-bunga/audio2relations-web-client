import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimelineService } from '../../services/timeline.service';

@Component({
  standalone: true,
  selector: 'app-calendar-page',
  imports: [CommonModule],
  template: `
    <div class="calendar-container">
      <div class="calendar-header">
        <h2 class="page-title">📅 Calendar</h2>
        <div class="calendar-controls">
          <button class="nav-btn" (click)="previousMonth()">
            <span class="nav-icon">◀</span>
          </button>
          <h3 class="current-month">{{ getCurrentMonthYear() }}</h3>
          <button class="nav-btn" (click)="nextMonth()">
            <span class="nav-icon">▶</span>
          </button>
        </div>
        <div class="view-controls">
          <button class="view-btn" [class.active]="viewMode() === 'month'" (click)="setViewMode('month')">Month</button>
          <button class="view-btn" [class.active]="viewMode() === 'week'" (click)="setViewMode('week')">Week</button>
          <button class="view-btn" [class.active]="viewMode() === 'day'" (click)="setViewMode('day')">Day</button>
        </div>
      </div>

      <div class="calendar-body">
        <!-- Month View -->
        <div class="month-view" *ngIf="viewMode() === 'month'">
          <div class="weekdays-header">
            <div class="weekday" *ngFor="let day of weekDays">{{ day }}</div>
          </div>
          <div class="days-grid">
            <div 
              class="day-cell" 
              *ngFor="let day of getDaysInMonth(); let i = index"
              [class.other-month]="!day.isCurrentMonth"
              [class.today]="day.isToday"
              [class.has-events]="getEventsForDay(day.date).length > 0"
              (click)="selectDate(day.date)"
            >
              <div class="day-number">{{ day.dayNumber }}</div>
              <div class="day-events">
                <div 
                  class="event-dot" 
                  *ngFor="let event of getEventsForDay(day.date).slice(0, 3)"
                  [class.audio-event]="event.type === 'audio'"
                  [class.transcript-event]="event.type === 'transcript'"
                  [title]="event.type + ' - ' + formatTime(event.timestamp)"
                ></div>
                <div class="more-events" *ngIf="getEventsForDay(day.date).length > 3">
                  +{{ getEventsForDay(day.date).length - 3 }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Week View -->
        <div class="week-view" *ngIf="viewMode() === 'week'">
          <div class="week-header">
            <div class="time-column"></div>
            <div class="day-header" *ngFor="let day of getWeekDays()">
              <div class="day-name">{{ day.name }}</div>
              <div class="day-date" [class.today]="day.isToday">{{ day.date }}</div>
            </div>
          </div>
          <div class="week-grid">
            <div class="time-slot" *ngFor="let hour of getHours()">
              <div class="time-label">{{ formatHour(hour) }}</div>
              <div class="day-slot" *ngFor="let day of getWeekDays()">
                <div 
                  class="event-block" 
                  *ngFor="let event of getEventsForHour(day.date, hour)"
                  [class.audio-event]="event.type === 'audio'"
                  [class.transcript-event]="event.type === 'transcript'"
                  [title]="event.type + ' - ' + formatTime(event.timestamp)"
                >
                  {{ event.type }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Day View -->
        <div class="day-view" *ngIf="viewMode() === 'day'">
          <div class="day-header">
            <h3 class="selected-date">{{ formatDate(selectedDate()) }}</h3>
          </div>
          <div class="day-timeline">
            <div class="time-slot" *ngFor="let hour of getHours()">
              <div class="time-label">{{ formatHour(hour) }}</div>
              <div class="hour-content">
                <div 
                  class="event-item" 
                  *ngFor="let event of getEventsForHour(selectedDate(), hour)"
                  [class.audio-event]="event.type === 'audio'"
                  [class.transcript-event]="event.type === 'transcript'"
                >
                  <div class="event-time">{{ formatTime(event.timestamp) }}</div>
                  <div class="event-content">
                    <div class="event-type">{{ event.type | titlecase }}</div>
                    <div class="event-details" *ngIf="event.type === 'transcript' && event.payload.text">
                      {{ event.payload.text.substring(0, 50) }}{{ event.payload.text.length > 50 ? '...' : '' }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Event Details Sidebar -->
      <div class="event-sidebar" *ngIf="selectedEvents().length > 0">
        <div class="sidebar-header">
          <h3>Events for {{ formatDate(selectedDate()) }}</h3>
          <button class="close-btn" (click)="clearSelection()">×</button>
        </div>
        <div class="events-list">
          <div 
            class="event-card" 
            *ngFor="let event of selectedEvents()"
            [class.audio-event]="event.type === 'audio'"
            [class.transcript-event]="event.type === 'transcript'"
          >
            <div class="event-header">
              <span class="event-icon">{{ getEventIcon(event.type) }}</span>
              <span class="event-time">{{ formatTime(event.timestamp) }}</span>
            </div>
            <div class="event-title">{{ event.type | titlecase }}</div>
            <div class="event-actions">
              <button class="action-btn" *ngIf="event.type === 'audio'" (click)="playAudio(event)">
                <span class="action-icon">▶️</span>
                <span>Play</span>
              </button>
              <button class="action-btn" (click)="deleteEvent(event)">
                <span class="action-icon">🗑️</span>
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .calendar-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 20px;
      position: relative;
    }

    .calendar-header {
      margin-bottom: 30px;
    }

    .page-title {
      color: #d4af37;
      font-size: 2rem;
      font-weight: 700;
      text-align: center;
      margin-bottom: 20px;
      text-shadow: 0 2px 4px rgba(212, 175, 55, 0.3);
    }

    .calendar-controls {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 20px;
      margin-bottom: 20px;
    }

    .nav-btn {
      background: rgba(15, 20, 25, 0.8);
      border: 2px solid #d4af37;
      border-radius: 12px;
      padding: 12px 16px;
      color: #d4af37;
      cursor: pointer;
      transition: all 0.3s ease;
      backdrop-filter: blur(10px);
    }

    .nav-btn:hover {
      background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%);
      color: #0f1419;
      transform: translateY(-2px);
    }

    .nav-icon {
      font-size: 1.2rem;
      font-weight: 600;
    }

    .current-month {
      color: #e6e6e6;
      font-size: 1.5rem;
      font-weight: 600;
      min-width: 200px;
      text-align: center;
    }

    .view-controls {
      display: flex;
      justify-content: center;
      gap: 8px;
    }

    .view-btn {
      padding: 8px 16px;
      border-radius: 20px;
      border: 2px solid rgba(212, 175, 55, 0.3);
      background: rgba(15, 20, 25, 0.8);
      color: #b0b0b0;
      cursor: pointer;
      transition: all 0.3s ease;
      backdrop-filter: blur(10px);
    }

    .view-btn:hover {
      border-color: #d4af37;
      color: #d4af37;
    }

    .view-btn.active {
      background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%);
      color: #0f1419;
      border-color: #d4af37;
    }

    /* Month View */
    .month-view {
      background: rgba(15, 20, 25, 0.8);
      border-radius: 16px;
      padding: 20px;
      backdrop-filter: blur(10px);
      border: 2px solid rgba(212, 175, 55, 0.2);
    }

    .weekdays-header {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 1px;
      margin-bottom: 10px;
    }

    .weekday {
      padding: 12px;
      text-align: center;
      color: #d4af37;
      font-weight: 600;
      font-size: 0.9rem;
    }

    .days-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 1px;
    }

    .day-cell {
      min-height: 100px;
      padding: 8px;
      background: rgba(15, 20, 25, 0.6);
      border: 1px solid rgba(212, 175, 55, 0.1);
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
    }

    .day-cell:hover {
      background: rgba(212, 175, 55, 0.1);
      border-color: rgba(212, 175, 55, 0.3);
    }

    .day-cell.other-month {
      opacity: 0.4;
    }

    .day-cell.today {
      background: linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(212, 175, 55, 0.1) 100%);
      border-color: #d4af37;
    }

    .day-cell.has-events {
      border-color: rgba(212, 175, 55, 0.5);
    }

    .day-number {
      color: #e6e6e6;
      font-weight: 600;
      margin-bottom: 8px;
    }

    .day-events {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .event-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #d4af37;
    }

    .event-dot.audio-event {
      background: #007bff;
    }

    .event-dot.transcript-event {
      background: #28a745;
    }

    .more-events {
      font-size: 0.7rem;
      color: #b0b0b0;
      text-align: center;
    }

    /* Week View */
    .week-view {
      background: rgba(15, 20, 25, 0.8);
      border-radius: 16px;
      backdrop-filter: blur(10px);
      border: 2px solid rgba(212, 175, 55, 0.2);
    }

    .week-header {
      display: grid;
      grid-template-columns: 60px repeat(7, 1fr);
      gap: 1px;
      border-bottom: 1px solid rgba(212, 175, 55, 0.2);
    }

    .day-header {
      padding: 12px;
      text-align: center;
      background: rgba(15, 20, 25, 0.8);
    }

    .day-name {
      color: #d4af37;
      font-weight: 600;
      font-size: 0.9rem;
    }

    .day-date {
      color: #e6e6e6;
      font-size: 1.1rem;
      font-weight: 600;
    }

    .day-date.today {
      color: #d4af37;
    }

    .week-grid {
      display: grid;
      grid-template-columns: 60px repeat(7, 1fr);
      gap: 1px;
    }

    .time-slot {
      display: grid;
      grid-template-columns: 60px repeat(7, 1fr);
      gap: 1px;
      min-height: 60px;
    }

    .time-label {
      padding: 8px;
      color: #b0b0b0;
      font-size: 0.8rem;
      text-align: right;
      border-right: 1px solid rgba(212, 175, 55, 0.1);
    }

    .day-slot {
      background: rgba(15, 20, 25, 0.6);
      border: 1px solid rgba(212, 175, 55, 0.05);
      position: relative;
    }

    .event-block {
      background: #d4af37;
      color: #0f1419;
      padding: 2px 6px;
      margin: 1px;
      border-radius: 4px;
      font-size: 0.7rem;
      font-weight: 600;
    }

    .event-block.audio-event {
      background: #007bff;
      color: white;
    }

    .event-block.transcript-event {
      background: #28a745;
      color: white;
    }

    /* Day View */
    .day-view {
      background: rgba(15, 20, 25, 0.8);
      border-radius: 16px;
      backdrop-filter: blur(10px);
      border: 2px solid rgba(212, 175, 55, 0.2);
    }

    .day-header {
      padding: 20px;
      border-bottom: 1px solid rgba(212, 175, 55, 0.2);
    }

    .selected-date {
      color: #d4af37;
      font-size: 1.5rem;
      font-weight: 600;
      margin: 0;
    }

    .day-timeline {
      max-height: 600px;
      overflow-y: auto;
    }

    .event-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 12px 20px;
      border-bottom: 1px solid rgba(212, 175, 55, 0.1);
      transition: all 0.3s ease;
    }

    .event-item:hover {
      background: rgba(212, 175, 55, 0.1);
    }

    .event-time {
      color: #d4af37;
      font-weight: 600;
      min-width: 80px;
    }

    .event-content {
      flex: 1;
    }

    .event-type {
      color: #e6e6e6;
      font-weight: 600;
      margin-bottom: 4px;
    }

    .event-details {
      color: #b0b0b0;
      font-size: 0.9rem;
    }

    /* Event Sidebar */
    .event-sidebar {
      position: fixed;
      right: 20px;
      top: 100px;
      width: 300px;
      background: rgba(15, 20, 25, 0.95);
      border: 2px solid #d4af37;
      border-radius: 16px;
      backdrop-filter: blur(20px);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
      z-index: 1000;
    }

    .sidebar-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      border-bottom: 1px solid rgba(212, 175, 55, 0.2);
    }

    .sidebar-header h3 {
      color: #d4af37;
      margin: 0;
      font-size: 1.1rem;
    }

    .close-btn {
      background: none;
      border: none;
      color: #b0b0b0;
      font-size: 1.5rem;
      cursor: pointer;
      padding: 0;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: all 0.3s ease;
    }

    .close-btn:hover {
      background: rgba(220, 53, 69, 0.2);
      color: #dc3545;
    }

    .events-list {
      max-height: 400px;
      overflow-y: auto;
      padding: 16px;
    }

    .event-card {
      background: rgba(15, 20, 25, 0.6);
      border: 1px solid rgba(212, 175, 55, 0.2);
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 12px;
      transition: all 0.3s ease;
    }

    .event-card:hover {
      border-color: #d4af37;
      transform: translateY(-2px);
    }

    .event-card.audio-event {
      border-left: 4px solid #007bff;
    }

    .event-card.transcript-event {
      border-left: 4px solid #28a745;
    }

    .event-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
    }

    .event-icon {
      font-size: 1.2rem;
    }

    .event-time {
      color: #d4af37;
      font-size: 0.9rem;
      font-weight: 600;
    }

    .event-title {
      color: #e6e6e6;
      font-weight: 600;
      margin-bottom: 12px;
    }

    .event-actions {
      display: flex;
      gap: 8px;
    }

    .action-btn {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 6px 12px;
      border-radius: 8px;
      border: 1px solid rgba(212, 175, 55, 0.3);
      background: rgba(15, 20, 25, 0.8);
      color: #e6e6e6;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 0.8rem;
    }

    .action-btn:hover {
      background: rgba(212, 175, 55, 0.2);
      border-color: #d4af37;
    }

    .action-icon {
      font-size: 0.9rem;
    }

    @media (max-width: 768px) {
      .calendar-container {
        padding: 10px;
      }

      .event-sidebar {
        position: fixed;
        right: 10px;
        left: 10px;
        width: auto;
        top: 50%;
        transform: translateY(-50%);
      }

      .days-grid {
        grid-template-columns: repeat(7, 1fr);
      }

      .day-cell {
        min-height: 80px;
        padding: 4px;
      }

      .week-header,
      .week-grid {
        grid-template-columns: 50px repeat(7, 1fr);
      }

      .time-label {
        padding: 4px;
        font-size: 0.7rem;
      }
    }
  `]
})
export class CalendarPage {
  private timeline = inject(TimelineService);
  currentDate = signal(new Date());
  viewMode = signal<'month' | 'week' | 'day'>('month');
  selectedDate = signal(new Date());
  selectedEvents = signal<any[]>([]);

  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  getCurrentMonthYear(): string {
    return this.currentDate().toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  }

  previousMonth(): void {
    const newDate = new Date(this.currentDate());
    newDate.setMonth(newDate.getMonth() - 1);
    this.currentDate.set(newDate);
  }

  nextMonth(): void {
    const newDate = new Date(this.currentDate());
    newDate.setMonth(newDate.getMonth() + 1);
    this.currentDate.set(newDate);
  }

  setViewMode(mode: 'month' | 'week' | 'day'): void {
    this.viewMode.set(mode);
  }

  getDaysInMonth(): any[] {
    const year = this.currentDate().getFullYear();
    const month = this.currentDate().getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const today = new Date();

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      days.push({
        date: date,
        dayNumber: date.getDate(),
        isCurrentMonth: date.getMonth() === month,
        isToday: date.toDateString() === today.toDateString()
      });
    }

    return days;
  }

  getWeekDays(): any[] {
    const today = new Date();
    const days = [];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - today.getDay() + i);
      
      days.push({
        date: date,
        name: date.toLocaleDateString('en-US', { weekday: 'short' }),
        isToday: date.toDateString() === today.toDateString()
      });
    }
    
    return days;
  }

  getHours(): number[] {
    return Array.from({ length: 24 }, (_, i) => i);
  }

  formatHour(hour: number): string {
    return hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`;
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  formatTime(timestamp: number): string {
    return new Date(timestamp).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  getEventsForDay(date: Date): any[] {
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    return this.timeline.events().filter(event => {
      const eventDate = new Date(event.timestamp);
      return eventDate >= dayStart && eventDate <= dayEnd;
    });
  }

  getEventsForHour(date: Date, hour: number): any[] {
    const hourStart = new Date(date);
    hourStart.setHours(hour, 0, 0, 0);
    const hourEnd = new Date(date);
    hourEnd.setHours(hour, 59, 59, 999);

    return this.timeline.events().filter(event => {
      const eventDate = new Date(event.timestamp);
      return eventDate >= hourStart && eventDate <= hourEnd;
    });
  }

  selectDate(date: Date): void {
    this.selectedDate.set(date);
    this.selectedEvents.set(this.getEventsForDay(date));
  }

  clearSelection(): void {
    this.selectedEvents.set([]);
  }

  getEventIcon(type: string): string {
    switch (type) {
      case 'audio': return '🎵';
      case 'transcript': return '📝';
      default: return '📋';
    }
  }

  async playAudio(event: any): Promise<void> {
    if (event.type === 'audio' && event.payload.blobRef) {
      const { StorageService } = await import('../../services/storage.service');
      const storage = new StorageService();
      const url = await storage.getBlobUrl(event.payload.blobRef);
      if (url) {
        new Audio(url).play();
      }
    }
  }

  async deleteEvent(event: any): Promise<void> {
    await this.timeline.removeEvent(event.id);
    this.selectedEvents.set(this.getEventsForDay(this.selectedDate()));
  }
}


