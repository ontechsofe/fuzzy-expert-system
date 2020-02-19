import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthService} from "../services/auth.service";
import * as jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class SafetyGuard implements CanActivate {
  canAccess: boolean;
  constructor(private auth: AuthService, private router: Router){};
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let token = localStorage.getItem('token');
    if (token) {
      let jwt = jwt_decode(token);
      //TODO: Make sure to check jwt expiry after
      this.auth.checkComplete().subscribe(data => {
        console.log(data);
        this.canAccess = data.data.complete
      });
      if (this.canAccess) {
        return true;
      } else {
        this.router.navigate(['/', 'questions'])
      }
    } else {
      return false;
    }
  }

}
