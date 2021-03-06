import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from "./pages/login/login.component";
import {RegisterComponent} from "./pages/register/register.component";
import {QuestionsComponent} from "./components/questions/questions.component";
import {HomeComponent} from "./pages/home/home.component";
import {SafetyGuard} from "./guards/safety.guard";


const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'questions',
    component: QuestionsComponent
  },
  {
    path: 'home',
    component: HomeComponent,
    // canActivate: [SafetyGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
