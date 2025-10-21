import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CardModule, ButtonModule],
  templateUrl: './home.component.html',
  styles: [`
    .home-wrap {
      min-height: calc(100dvh - 64px);
      display: grid;
      place-items: center;
      padding: 16px;
    }
    .hero { text-align: center; padding: 24px; }
    .sub { margin: 8px 0 20px; color: #cbd5e1; }
    .home-btn { width: 220px; font-weight: 600; border-radius: 12px; }
  `]
})
export class HomeComponent {}
