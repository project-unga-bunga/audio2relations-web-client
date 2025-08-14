import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

type Node = { id: string; label: string; x: number; y: number };
type Edge = { from: string; to: string };

@Component({
  standalone: true,
  selector: 'app-diagram-page',
  imports: [CommonModule],
  template: `
    <h2>Interactive Diagram</h2>
    <div class="canvas" #canvas>
      <svg [attr.viewBox]="'0 0 800 400'" (mousedown)="onDown($event)" (mousemove)="onMove($event)" (mouseup)="onUp()">
        <g>
          <line *ngFor="let e of edges" [attr.x1]="getNode(e.from).x" [attr.y1]="getNode(e.from).y" [attr.x2]="getNode(e.to).x" [attr.y2]="getNode(e.to).y" stroke="#aaa" />
        </g>
        <g>
          <g *ngFor="let n of nodes" [attr.transform]="'translate(' + n.x + ',' + n.y + ')'" (mousedown)="select(n, $event)">
            <circle r="24" fill="#27ae60"></circle>
            <text x="0" y="5" text-anchor="middle" fill="#fff">{{ n.label }}</text>
          </g>
        </g>
      </svg>
    </div>
  `,
  styles: [`
    .canvas{border:1px solid #eee;border-radius:8px;overflow:hidden}
    svg{width:100%;height:360px;touch-action:none}
  `]
})
export class DiagramPage {
  nodes: Node[] = [
    { id: 'a', label: 'Audio', x: 100, y: 120 },
    { id: 'b', label: 'Sensors', x: 260, y: 80 },
    { id: 'c', label: 'Timeline', x: 420, y: 140 },
  ];
  edges: Edge[] = [
    { from: 'a', to: 'c' },
    { from: 'b', to: 'c' }
  ];
  private dragging: Node | null = null;

  getNode(id: string){ return this.nodes.find(n => n.id === id)!; }
  select(n: Node, e: MouseEvent){ this.dragging = n; e.stopPropagation(); }
  onDown(_: MouseEvent){ this.dragging = null; }
  onMove(e: MouseEvent){ if (this.dragging){ this.dragging.x = e.offsetX; this.dragging.y = e.offsetY; } }
  onUp(){ this.dragging = null; }
}


