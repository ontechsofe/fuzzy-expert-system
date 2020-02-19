import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import sha256 from "sha256"

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<{success: boolean, data: {jwt: string}}> {
    let url = '';
    let body = {
      username: username,
      password: sha256(password)
    };
    return this.http.post<{success: boolean, data: {jwt: string}}>(url, body);
  }

  register(username: string, password: string, name: string, age: number, gender: string): Observable<{success: boolean}> {
    let url = '';
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
