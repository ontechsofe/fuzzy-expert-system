import { Component, OnInit } from '@angular/core';
import { Questions } from "../../types/questions";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss']
})
export class QuestionsComponent implements OnInit {

  questions: Questions[];
  answers: any;

  constructor(private http: HttpClient, private profile: AuthService) {
    this.answers = {};
    this.getJsonQuestions().subscribe(data => {
      this.questions = data.data;
      this.questions.forEach(q => this.answers[q.label] = [0, 0]);
    });
  }

  ngOnInit(): void {
  }

  getJsonQuestions(): Observable<{data: Questions[]}> {
    return this.http.get<{data: Questions[]}>('assets/json/questions.json');
  }

  answer(event: any, questionId: string, fieldId: number): void {
    this.answers[questionId][fieldId] = event.value;
  }

  submit() {
    this.profile.completeProfile(this.answers).subscribe(data => {
      if (data.success) {
      //  USER PROFILE ANSWERS SUCCESSFUL
        console.log("Answers Submitted");
      } else {
      //  NOT ENTERED
        console.log("Answers Not Submitted");
      }
    });
  }
}
