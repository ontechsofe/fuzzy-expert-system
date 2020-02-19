import { Component } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'fuzzy-expert-system';
  constructor(private router: Router) {
  }
  logout(): void {
    localStorage.clear();
    alert('You are now logged out');
    this.router.navigate(['/', 'login']);
  }
}
