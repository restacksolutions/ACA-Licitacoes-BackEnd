# 🎯 **Configuração do Frontend para Requisições - Guia Prático**

## ✅ **Backend Pronto:**
- ✅ CORS habilitado
- ✅ Helmet configurado para desenvolvimento
- ✅ OPTIONS tratadas
- ✅ Headers CORS em todas as respostas

## 🚀 **O que fazer no Frontend:**

### **1. Configurar HttpClientModule (OBRIGATÓRIO)**

#### **1.1. No app.module.ts:**
```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';  // ← ADICIONAR
import { ReactiveFormsModule } from '@angular/forms';     // ← ADICIONAR

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,      // ← ADICIONAR
    ReactiveFormsModule    // ← ADICIONAR
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

### **2. Criar Serviço de API (OBRIGATÓRIO)**

#### **2.1. Criar arquivo: src/app/services/api.service.ts**
```typescript
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:3000/v1';

  constructor(private http: HttpClient) {}

  // Headers padrão para requisições
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  }

  // Headers com autenticação
  private getAuthHeaders(token: string): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Teste de conexão
  healthCheck(): Observable<any> {
    return this.http.get(`${this.baseUrl}/health`, { headers: this.getHeaders() });
  }

  // Login
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, {
      email,
      password
    }, { headers: this.getHeaders() });
  }

  // Registrar usuário
  register(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/register`, userData, { headers: this.getHeaders() });
  }

  // Obter usuário atual
  getCurrentUser(token: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/auth/me`, { headers: this.getAuthHeaders(token) });
  }

  // Refresh token
  refreshToken(refreshToken: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/refresh`, {
      refresh_token: refreshToken
    }, { headers: this.getHeaders() });
  }
}
```

### **3. Atualizar app.component.ts (EXEMPLO COMPLETO)**

#### **3.1. Substituir o conteúdo do app.component.ts:**
```typescript
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'ACA Licitações';
  
  // Formulário de login
  loginForm: FormGroup;
  
  // Estados da aplicação
  loading = false;
  authenticated = false;
  user: any = null;
  error: string | null = null;
  result: any = null;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    this.checkAuthStatus();
  }

  // Verificar se já está autenticado
  checkAuthStatus(): void {
    const token = localStorage.getItem('access_token');
    const user = localStorage.getItem('current_user');
    
    if (token && user) {
      this.authenticated = true;
      this.user = JSON.parse(user);
    }
  }

  // Teste de conexão com o backend
  testConnection(): void {
    this.loading = true;
    this.error = null;
    this.result = null;

    console.log('🧪 Testando conexão com backend...');

    this.apiService.healthCheck().subscribe({
      next: (response) => {
        this.result = response;
        this.loading = false;
        console.log('✅ Conexão OK:', response);
      },
      error: (error) => {
        this.error = `Erro de conexão: ${error.message}`;
        this.loading = false;
        console.error('❌ Erro de conexão:', error);
      }
    });
  }

  // Login
  login(): void {
    if (this.loginForm.valid && !this.loading) {
      this.loading = true;
      this.error = null;
      this.result = null;

      const { email, password } = this.loginForm.value;

      console.log('🔐 Fazendo login...', { email });

      this.apiService.login(email, password).subscribe({
        next: (response: any) => {
          this.result = response;
          this.loading = false;
          
          // Salvar dados de autenticação
          if (response.access_token) {
            localStorage.setItem('access_token', response.access_token);
            localStorage.setItem('refresh_token', response.refresh_token);
            localStorage.setItem('current_user', JSON.stringify(response.user));
            
            this.authenticated = true;
            this.user = response.user;
            
            console.log('✅ Login OK:', response);
          }
        },
        error: (error) => {
          this.error = `Erro de login: ${error.error?.message || error.message}`;
          this.loading = false;
          console.error('❌ Erro de login:', error);
        }
      });
    }
  }

  // Logout
  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('current_user');
    
    this.authenticated = false;
    this.user = null;
    this.result = null;
    this.error = null;
    
    console.log('👋 Logout realizado');
  }

  // Teste de requisição autenticada
  testAuthenticatedRequest(): void {
    if (!this.authenticated) {
      this.error = 'Você precisa estar logado para fazer esta requisição';
      return;
    }

    this.loading = true;
    this.error = null;
    this.result = null;

    const token = localStorage.getItem('access_token');

    console.log('🔒 Fazendo requisição autenticada...');

    this.apiService.getCurrentUser(token!).subscribe({
      next: (response) => {
        this.result = response;
        this.loading = false;
        console.log('✅ Requisição autenticada OK:', response);
      },
      error: (error) => {
        this.error = `Erro na requisição autenticada: ${error.error?.message || error.message}`;
        this.loading = false;
        console.error('❌ Erro na requisição autenticada:', error);
      }
    });
  }

  // Limpar resultados
  clearResults(): void {
    this.result = null;
    this.error = null;
  }
}
```

### **4. Template HTML (app.component.html)**

#### **4.1. Substituir o conteúdo do app.component.html:**
```html
<div class="app-container">
  <header class="app-header">
    <h1>{{ title }}</h1>
    <div class="auth-status" [class.authenticated]="authenticated">
      <span *ngIf="!authenticated">❌ Não autenticado</span>
      <span *ngIf="authenticated">✅ Autenticado como: {{ user?.email }}</span>
    </div>
  </header>

  <main class="app-main">
    <!-- Seção de Testes de Conexão -->
    <section class="test-section">
      <h2>🧪 Testes de Conexão</h2>
      
      <div class="button-group">
        <button 
          (click)="testConnection()" 
          [disabled]="loading"
          class="test-button"
        >
          {{ loading ? '⏳ Testando...' : '🔍 Testar Health Check' }}
        </button>
      </div>
    </section>

    <!-- Seção de Login -->
    <section class="login-section" *ngIf="!authenticated">
      <h2>🔐 Login</h2>
      
      <form [formGroup]="loginForm" (ngSubmit)="login()" class="login-form">
        <div class="form-group">
          <label for="email">Email:</label>
          <input 
            type="email" 
            id="email" 
            formControlName="email"
            placeholder="seu@email.com"
            [class.error]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
          >
          <div *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched" 
               class="error-message">
            Email é obrigatório e deve ser válido
          </div>
        </div>

        <div class="form-group">
          <label for="password">Senha:</label>
          <input 
            type="password" 
            id="password" 
            formControlName="password"
            placeholder="Sua senha"
            [class.error]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
          >
          <div *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched" 
               class="error-message">
            Senha é obrigatória (mínimo 6 caracteres)
          </div>
        </div>

        <button 
          type="submit" 
          [disabled]="loginForm.invalid || loading"
          class="login-button"
        >
          {{ loading ? '⏳ Entrando...' : '🚀 Entrar' }}
        </button>
      </form>
    </section>

    <!-- Seção de Usuário Autenticado -->
    <section class="authenticated-section" *ngIf="authenticated">
      <h2>👤 Área do Usuário</h2>
      
      <div class="user-info">
        <h3>Informações do Usuário:</h3>
        <p><strong>Email:</strong> {{ user?.email }}</p>
        <p><strong>Nome:</strong> {{ user?.name || 'N/A' }}</p>
        <p><strong>ID:</strong> {{ user?.id || 'N/A' }}</p>
      </div>

      <div class="button-group">
        <button 
          (click)="testAuthenticatedRequest()" 
          [disabled]="loading"
          class="test-button"
        >
          {{ loading ? '⏳ Testando...' : '🔒 Testar Requisição Autenticada' }}
        </button>
        
        <button 
          (click)="logout()" 
          class="logout-button"
        >
          👋 Logout
        </button>
      </div>
    </section>

    <!-- Seção de Resultados -->
    <section class="results-section" *ngIf="result || error">
      <h2>📊 Resultados</h2>
      
      <div *ngIf="result" class="result-success">
        <h3>✅ Sucesso:</h3>
        <pre>{{ result | json }}</pre>
      </div>
      
      <div *ngIf="error" class="result-error">
        <h3>❌ Erro:</h3>
        <p>{{ error }}</p>
      </div>

      <button (click)="clearResults()" class="clear-button">
        🗑️ Limpar Resultados
      </button>
    </section>
  </main>

  <footer class="app-footer">
    <p>Backend: http://localhost:3000 | Frontend: http://localhost:4200</p>
  </footer>
</div>
```

### **5. Estilos CSS (app.component.css)**

#### **5.1. Substituir o conteúdo do app.component.css:**
```css
/* Estilos básicos para o componente */
.app-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.app-header {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 20px;
  text-align: center;
  color: white;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
}

.app-header h1 {
  margin: 0 0 10px 0;
  font-size: 2.5rem;
  font-weight: 700;
}

.auth-status {
  font-size: 1.1rem;
  font-weight: 500;
}

.auth-status.authenticated {
  color: #4ade80;
}

.app-main {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

/* Seções */
.test-section,
.login-section,
.authenticated-section,
.results-section {
  background: white;
  margin: 20px 0;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.test-section h2,
.login-section h2,
.authenticated-section h2,
.results-section h2 {
  margin: 0 0 20px 0;
  color: #333;
  font-size: 1.5rem;
  font-weight: 600;
}

/* Grupos de botões */
.button-group {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  margin: 20px 0;
}

/* Botões */
.test-button,
.login-button,
.logout-button,
.clear-button {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-block;
}

.test-button {
  background: #3b82f6;
  color: white;
}

.test-button:hover:not(:disabled) {
  background: #2563eb;
  transform: translateY(-2px);
}

.test-button:disabled {
  background: #9ca3af;
  cursor: not-allowed;
  transform: none;
}

.login-button {
  background: #10b981;
  color: white;
  width: 100%;
  margin-top: 10px;
}

.login-button:hover:not(:disabled) {
  background: #059669;
  transform: translateY(-2px);
}

.login-button:disabled {
  background: #9ca3af;
  cursor: not-allowed;
  transform: none;
}

.logout-button {
  background: #ef4444;
  color: white;
}

.logout-button:hover {
  background: #dc2626;
  transform: translateY(-2px);
}

.clear-button {
  background: #6b7280;
  color: white;
}

.clear-button:hover {
  background: #4b5563;
  transform: translateY(-2px);
}

/* Formulário */
.login-form {
  max-width: 400px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #374151;
  font-weight: 500;
  font-size: 0.9rem;
}

.form-group input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-group input.error {
  border-color: #ef4444;
}

.error-message {
  color: #ef4444;
  font-size: 0.8rem;
  margin-top: 5px;
  font-weight: 500;
}

/* Informações do usuário */
.user-info {
  background: #f8fafc;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.user-info h3 {
  margin: 0 0 15px 0;
  color: #1f2937;
  font-size: 1.2rem;
}

.user-info p {
  margin: 8px 0;
  color: #4b5563;
}

/* Resultados */
.result-success {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 15px;
}

.result-success h3 {
  margin: 0 0 15px 0;
  color: #166534;
  font-size: 1.1rem;
}

.result-error {
  background: #fef2f2;
  border: 1px solid #fecaca;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 15px;
}

.result-error h3 {
  margin: 0 0 15px 0;
  color: #dc2626;
  font-size: 1.1rem;
}

.result-success pre,
.result-error pre {
  background: white;
  padding: 15px;
  border-radius: 6px;
  overflow-x: auto;
  font-size: 0.9rem;
  line-height: 1.4;
  margin: 0;
  border: 1px solid #e5e7eb;
}

.result-error p {
  margin: 0;
  color: #dc2626;
  font-weight: 500;
}

/* Footer */
.app-footer {
  text-align: center;
  padding: 20px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
}

/* Responsividade */
@media (max-width: 768px) {
  .app-main {
    padding: 10px;
  }
  
  .test-section,
  .login-section,
  .authenticated-section,
  .results-section {
    padding: 20px;
  }
  
  .button-group {
    flex-direction: column;
  }
  
  .app-header h1 {
    font-size: 2rem;
  }
}
```

---

## 🚀 **Como Testar:**

### **1. Iniciar o Backend:**
```bash
cd aca-back
npm run start:dev
```

### **2. Iniciar o Frontend:**
```bash
ng serve
```

### **3. Testar no Browser:**
1. Abrir http://localhost:4200
2. Clicar em "🔍 Testar Health Check"
3. Deve mostrar: `{"status":"ok",...}`
4. Fazer login com email e senha
5. Testar requisições autenticadas

---

## ✅ **Checklist Final:**

- [ ] HttpClientModule importado no app.module.ts
- [ ] ReactiveFormsModule importado no app.module.ts
- [ ] ApiService criado com métodos corretos
- [ ] app.component.ts atualizado
- [ ] app.component.html atualizado
- [ ] app.component.css atualizado
- [ ] Backend rodando em http://localhost:3000
- [ ] Frontend rodando em http://localhost:4200
- [ ] Teste de conexão funcionando
- [ ] Login funcionando
- [ ] Requisições autenticadas funcionando

**Pronto! Seu frontend vai funcionar perfeitamente com o backend!** 🎉
