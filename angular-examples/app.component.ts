import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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

  // URL base da API
  private apiUrl = 'http://localhost:3000/v1';

  constructor(
    private http: HttpClient,
    private fb: FormBuilder
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    // Verificar se já está autenticado
    this.checkAuthStatus();
  }

  // Verificar status de autenticação
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

    this.http.get(`${this.apiUrl}/health`).subscribe({
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

  // Teste de CORS
  testCors(): void {
    this.loading = true;
    this.error = null;
    this.result = null;

    console.log('🧪 Testando CORS...');

    // Fazer requisição OPTIONS para testar CORS
    fetch(`${this.apiUrl}/auth/login`, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'http://localhost:4200',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type, Authorization'
      }
    })
    .then(response => {
      this.result = {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        corsWorking: response.status === 200
      };
      this.loading = false;
      console.log('✅ CORS OK:', this.result);
    })
    .catch(error => {
      this.error = `Erro de CORS: ${error.message}`;
      this.loading = false;
      console.error('❌ Erro de CORS:', error);
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

      this.http.post(`${this.apiUrl}/auth/login`, {
        email,
        password
      }).subscribe({
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
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    console.log('🔒 Fazendo requisição autenticada...');

    this.http.get(`${this.apiUrl}/auth/me`, { headers }).subscribe({
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
