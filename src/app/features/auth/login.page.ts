import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-login-page',
  imports: [CommonModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <div class="app-icon">🎤</div>
          <h1 class="app-title">Audio Recorder</h1>
          <p class="app-subtitle">Professional Audio Recording & Timeline Management</p>
        </div>
        
        <div class="login-form">
          <div class="welcome-message">
            <h2 class="welcome-title">Welcome!</h2>
            <p class="welcome-text">Get started with your audio recording journey</p>
          </div>
          
          <button class="guest-login-btn" (click)="loginAsGuest()">
            <span class="btn-icon">👤</span>
            <span class="btn-text">Continue as Guest</span>
            <span class="btn-arrow">→</span>
          </button>
          
          <div class="features-preview">
            <h3 class="features-title">What you can do:</h3>
            <div class="features-list">
              <div class="feature-item">
                <span class="feature-icon">🎵</span>
                <span class="feature-text">Record high-quality audio</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">📅</span>
                <span class="feature-text">Organize recordings in timeline</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">📝</span>
                <span class="feature-text">Add transcriptions & notes</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">📊</span>
                <span class="feature-text">View analytics & insights</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      background: linear-gradient(135deg, #0f1419 0%, #1a2332 50%, #0f1419 100%);
    }
    
    .login-card {
      background: rgba(15, 20, 25, 0.95);
      border: 2px solid #d4af37;
      border-radius: 24px;
      padding: 40px;
      max-width: 500px;
      width: 100%;
      backdrop-filter: blur(20px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    }
    
    .login-header {
      text-align: center;
      margin-bottom: 40px;
    }
    
    .app-icon {
      font-size: 4rem;
      margin-bottom: 16px;
    }
    
    .app-title {
      color: #d4af37;
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 8px;
      text-shadow: 0 2px 4px rgba(212, 175, 55, 0.3);
    }
    
    .app-subtitle {
      color: #b0b0b0;
      font-size: 1.1rem;
      font-weight: 400;
    }
    
    .login-form {
      display: flex;
      flex-direction: column;
      gap: 30px;
    }
    
    .welcome-message {
      text-align: center;
    }
    
    .welcome-title {
      color: #e6e6e6;
      font-size: 1.8rem;
      font-weight: 600;
      margin-bottom: 8px;
    }
    
    .welcome-text {
      color: #b0b0b0;
      font-size: 1rem;
    }
    
    .guest-login-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      padding: 20px 24px;
      background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%);
      color: #0f1419;
      border: none;
      border-radius: 16px;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 8px 24px rgba(212, 175, 55, 0.3);
    }
    
    .guest-login-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 32px rgba(212, 175, 55, 0.4);
    }
    
    .btn-icon {
      font-size: 1.3rem;
    }
    
    .btn-text {
      font-size: 1.1rem;
    }
    
    .btn-arrow {
      font-size: 1.2rem;
      transition: transform 0.3s ease;
    }
    
    .guest-login-btn:hover .btn-arrow {
      transform: translateX(4px);
    }
    
    .features-preview {
      background: rgba(15, 20, 25, 0.6);
      border: 1px solid rgba(212, 175, 55, 0.2);
      border-radius: 16px;
      padding: 24px;
    }
    
    .features-title {
      color: #d4af37;
      font-size: 1.2rem;
      font-weight: 600;
      margin-bottom: 16px;
      text-align: center;
    }
    
    .features-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    
    .feature-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 0;
    }
    
    .feature-icon {
      font-size: 1.2rem;
      width: 24px;
      text-align: center;
    }
    
    .feature-text {
      color: #e6e6e6;
      font-size: 0.95rem;
      font-weight: 500;
    }
    
    @media (max-width: 600px) {
      .login-card {
        padding: 30px 20px;
      }
      
      .app-title {
        font-size: 2rem;
      }
      
      .app-subtitle {
        font-size: 1rem;
      }
      
      .welcome-title {
        font-size: 1.5rem;
      }
      
      .guest-login-btn {
        padding: 16px 20px;
        font-size: 1rem;
      }
      
      .btn-text {
        font-size: 1rem;
      }
    }
  `]
})
export class LoginPage {
  private auth = inject(AuthService);

  loginAsGuest() {
    this.auth.loginGuest();
  }
}


