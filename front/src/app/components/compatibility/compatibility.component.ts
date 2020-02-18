import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-compatibility',
  templateUrl: './compatibility.component.html',
  styleUrls: ['./compatibility.component.scss']
})
export class CompatibilityComponent implements OnInit {

  @Input() user: {
    userId: any;
    name: string;
    userCompatibility: number;
    theirCompatibility: number;
  };


  constructor() { }

  ngOnInit(): void {
  }

}
