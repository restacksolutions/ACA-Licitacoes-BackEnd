import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,  // ← Necessário para fazer requisições HTTP
    ReactiveFormsModule  // ← Necessário para formulários reativos
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
