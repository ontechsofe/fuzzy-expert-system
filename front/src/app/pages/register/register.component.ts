import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  genders: string[];
  ethnicities: string[];

  constructor() {
    this.genders = ['male', 'female'];
    this.ethnicities = [
      'Caucasian',
      'Asian',
      'Mixed',
      'African',
      'Other'
    ];
  }

  ngOnInit(): void {
  }

}
