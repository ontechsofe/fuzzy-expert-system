import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  genders: string[];

  constructor(private auth: AuthService, private router: Router) {
    this.genders = ['male', 'female'];
  }

  ngOnInit(): void {
  }

  register(name: string, username: string, password: string, age: string, gender: string): void {
    this.auth.register(username, password, name, parseInt(age), gender).subscribe(data => {
      if (data.success) {
      //  REDIRECT TO LOGIN IF SUCCESS
        console.log("User Registered");
        this.router.navigate(['/', 'login']).then(nav => {
            console.log(nav); // true if navigation is successful
          }, err => {
            console.log(err) // when there's an error
          });
      } else {
      //  ALERT USER IT DIDN'T WORK
        console.log("User Not Registered");
        alert('User not registered. There was an Issue.');
      }
    })
  }

}
