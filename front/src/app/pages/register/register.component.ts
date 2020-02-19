import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  genders: string[];

  constructor(private auth: AuthService) {
    this.genders = ['male', 'female', 'other'];
  }

  ngOnInit(): void {
  }

  register(name: string, username: string, password: string, age: string, gender: string): void {
    console.log({name, username, password, age, gender});
    this.auth.register(username, password, name, parseInt(age), gender).subscribe(data => {
      if (data.success) {
      //  REDIRECT TO LOGIN IF SUCCESS
        console.log("User Registered")
      } else {
      //  ALERT USER IT DIDN'T WORK
        console.log("User Not Registered")
      }
    })
  }

}
