import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import sha256 from "sha256"

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseURL: string;

  constructor(private http: HttpClient) {
    this.baseURL = 'http://localhost:8080/api/user';
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

  checkComplete(userId: number): Observable<{data: any, success: boolean}> {
    let url = this.baseURL + '/check';
    let body = {
      userId: userId
    };
    return this.http.post<{data: any, success: boolean}>(url, body);
  }

  completeProfile(userId: number) {
    let url = this.baseURL + '/complete';
    let body = {
      userId: userId
    };
    return this.http.post<{success: boolean}>(url, body);
  }
}
