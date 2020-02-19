import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  users: {
    userId: any;
    name: string;
    userCompatibility: number;
    theirCompatibility: number;
  }[];

  constructor() {
    this.users = [{
      userId: 5,
      name: 'hobo',
      userCompatibility: 0.98,
      theirCompatibility: 0.92
    }]

  }

  ngOnInit(): void {
  }

}
