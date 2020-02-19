import { Component, OnInit } from '@angular/core';
import * as jwt_decode from 'jwt-decode';
import {FuzzyService} from "../../services/fuzzy.service";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  user: any;
  users: {
    userId: any;
    name: string;
    compatibilityWithUser: number;
    compatibilityWithThem: number;
  }[];
  complete: boolean = true;

  constructor(private fuzzy: FuzzyService, private auth: AuthService, private router: Router) {
    if (!this.auth.loggedIn()) {
      this.router.navigate(['/', 'login']);
      alert('You are not logged in.');
      return;
    }
    this.auth.checkComplete().subscribe(data => {
      if (data.success) {
        if (data.data.complete) {
          console.log('You are an answerer of questions.');
        } else {
          alert('You haven\'t answered the questions yet.');
          this.complete = false;
          this.router.navigate(['/', 'questions']);
        }
      } else {
        alert('Something went wrong.');
        this.complete = false;
        this.router.navigate(['/', 'login']);
      }
    });
    if (this.complete) {
      this.user = this.unpackJWT();
      this.fuzzy.getCompatibility("0", "100", 'male').subscribe(data => {
        if (data.success) {
          console.log("Works");
          this.users = data.data;
        } else {
          console.log("Not Works!");
        }
      });
    }
  }

  ngOnInit(): void {
  }

  unpackJWT() {
    let jwt = localStorage.getItem('token');
    console.log(jwt_decode(jwt));
    return jwt_decode(jwt);
  }

}
