import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import * as jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class FuzzyService {

  baseURL: string;

  constructor(private http: HttpClient) {
    this.baseURL = 'http://localhost:8080/api/fuzzy-route';
  }

  private static getUserId(): number | null {
    let token = localStorage.getItem('token');
    if (token) {
      let jwt = jwt_decode(token);
      return jwt.userId;
    }
    return null;
  }

  getCompatibility(minAge: string, maxAge: string, gender): Observable<{data: any, success: boolean}> {
    let url = this.baseURL + '/compatibility-check';
    let body = {
      minAge: minAge,
      maxAge: maxAge,
      userId: FuzzyService.getUserId(),
      gender: gender
    };
    return this.http.post<{data: any, success: boolean}>(url, body);
  }

}
