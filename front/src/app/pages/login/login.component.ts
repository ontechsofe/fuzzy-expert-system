import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
  }

  login(username: string, password: string) {
    this.auth.login(username, password).subscribe(data => {
      if (data.success) {
        localStorage.setItem('token', data.data.jwt);
      }
    });
  }

}
