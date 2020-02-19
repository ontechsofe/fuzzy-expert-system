import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FuzzyService {

  baseURL: string;

  constructor() {
    this.baseURL = 'http://localhost:8080/api/fuzzy-route';
  }


}
