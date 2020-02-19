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
    this.baseURL = 'http://localhost:8080';
  }

  login(username: string, password: string): Observable<{success: boolean, data: {jwt: string}}> {
    let url = this.baseURL + '/api/user/login';
    let body = {
      username: username,
      password: sha256(password)
    };
    console.log(body);

    return this.http.post<{success: boolean, data: {jwt: string}}>(url, body);
  }

  register(username: string, password: string, name: string, age: number, gender: string): Observable<{success: boolean}> {
    let url = this.baseURL + '/api/user/create-user';
    let body = {
      username: username,
      password: sha256(password),
      name: name,
      age: age,
      gender: gender
    };
    return this.http.post<{success: boolean}>(url, body);
  }
}
