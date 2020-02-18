import { Component, OnInit } from '@angular/core';
import { Questions } from "../../types/questions";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss']
})
export class QuestionsComponent implements OnInit {

  questions: Questions[];

  constructor(private http: HttpClient) {
    this.getJsonQuestions().subscribe(data => {
      this.questions = data.data;
    });
  }

  ngOnInit(): void {
  }

  getJsonQuestions(): Observable<any> {
    return this.http.get('assets/json/questions.json');
  }

}
