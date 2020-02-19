import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialAngularModule } from "./material/material-angular.module";
import { RegisterComponent } from './pages/register/register.component';
import { QuestionsComponent } from './components/questions/questions.component';
import {HttpClientModule} from "@angular/common/http";
import { HomeComponent } from './pages/home/home.component';
import { CompatibilityComponent } from './components/compatibility/compatibility.component';
import {SafetyGuard} from "./guards/safety.guard";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    QuestionsComponent,
    HomeComponent,
    CompatibilityComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialAngularModule
  ],
  providers: [SafetyGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
