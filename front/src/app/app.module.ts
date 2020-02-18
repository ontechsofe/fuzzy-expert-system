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

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    QuestionsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialAngularModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
