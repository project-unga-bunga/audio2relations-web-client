import { Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SensorsService } from '../../services/sensors.service';

@Component({
  standalone: true,
  selector: 'app-sensors-page',
  imports: [CommonModule],
  template: `
    <h2>Sensors</h2>
    <div class="grid">
      <div>
        <h3>Gyroscope</h3>
        <div>X: {{ gyro().x?.toFixed(2) }}</div>
        <div>Y: {{ gyro().y?.toFixed(2) }}</div>
        <div>Z: {{ gyro().z?.toFixed(2) }}</div>
      </div>
      <div>
        <h3>Geolocation</h3>
        <div>Lat: {{ geo().lat?.toFixed(5) }}</div>
        <div>Lng: {{ geo().lng?.toFixed(5) }}</div>
        <div>Acc: {{ geo().accuracy }}</div>
      </div>
    </div>
  `,
  styles: [`
    .grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
    @media(max-width:600px){.grid{grid-template-columns:1fr}}
  `]
})
export class SensorsPage {
  private sensors = inject(SensorsService);
  gyro = this.sensors.gyro;
  geo = this.sensors.geo;

  constructor(){
    this.sensors.start();
  }
}


