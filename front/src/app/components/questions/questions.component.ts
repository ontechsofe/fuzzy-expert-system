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
  answers: number[][];

  constructor(private http: HttpClient) {
    this.answers = [];
    this.getJsonQuestions().subscribe(data => {
      this.questions = data.data;
      this.questions.forEach(q => this.answers.push([0, 0]) );
    });
  }

  ngOnInit(): void {
  }

  getJsonQuestions(): Observable<any> {
    return this.http.get('assets/json/questions.json');
  }

  answer(event: any, questionId: number, fieldId: number): void {
    this.answers[questionId][fieldId] = event.value;
  }


}
