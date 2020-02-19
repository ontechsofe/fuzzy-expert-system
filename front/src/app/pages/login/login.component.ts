import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  login(username: string, password: string) {
    this.auth.login(username, password).subscribe(data => {
      if (data.success) {
        console.log('User Logged In');
        localStorage.setItem('token', data.data.accessToken);
        this.router.navigate(['/', 'home']).then(nav => {
            console.log(nav); // true if navigation is successful
          }, err => {
            console.log(err) // when there's an error
          });
      } else {
        console.log('Didn\'t work. Not logged in');
        alert('Didn\'t work. Not logged in');
      }
    });
  }

}
