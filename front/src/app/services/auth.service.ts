import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import sha256 from "sha256"
import * as jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseURL: string;

  constructor(private http: HttpClient) {
    this.baseURL = 'http://localhost:8080/api/user';
  }

  private static getUserId(): number | null {
    let token = localStorage.getItem('token');
    if (token) {
      let jwt = jwt_decode(token);
      return jwt.userId;
    }
    return null;
  }

  login(username: string, password: string): Observable<{success: boolean, data: {accessToken: string}}> {
    let url = this.baseURL + '/login';
    let body = {
      username: username,
      password: sha256(password)
    };

    return this.http.post<{success: boolean, data: {accessToken: string}}>(url, body);
  }

  register(username: string, password: string, name: string, age: number, gender: string): Observable<{success: boolean}> {
    let url = this.baseURL + '/create-user';
    let body = {
      username: username,
      password: sha256(password),
      fullname: name,
      age: age,
      gender: gender
    };
    return this.http.post<{success: boolean}>(url, body);
  }

  checkComplete(): Observable<{data: any, success: boolean}> {
    let url = this.baseURL + '/check';
    let body = {
      userId: AuthService.getUserId()
    };
    return this.http.post<{data: any, success: boolean}>(url, body);
  }

  completeProfile(answers: any) {
    let url = this.baseURL + '/complete';
    let body = {
      userId: AuthService.getUserId(),
      answers: answers
    };
    return this.http.post<{success: boolean}>(url, body);
  }
}
