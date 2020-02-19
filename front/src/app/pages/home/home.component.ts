import { Component, OnInit } from '@angular/core';
import * as jwt_decode from 'jwt-decode';

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
    userCompatibility: number;
    theirCompatibility: number;
  }[];

  constructor() {
    this.user = this.unpackJWT();
    this.users = [{
      userId: 5,
      name: 'hobo',
      userCompatibility: 0.98,
      theirCompatibility: 0.92
    }]

  }

  ngOnInit(): void {
  }

  unpackJWT() {
    let jwt = localStorage.getItem('token');
    console.log(jwt_decode(jwt));
    return jwt_decode(jwt);
  }

}
