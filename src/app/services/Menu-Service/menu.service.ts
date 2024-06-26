import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UrlService } from '../URL/url.service';
import { AuthService } from '../Auth-Service/auth.service';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  constructor(
    private _http: HttpClient,
    private _urlService: UrlService,
    private authService: AuthService
  ) {}

  private headers(): HttpHeaders {
    const authKey = this.authService.getAuthKey();
    return new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      'Auth-Key': JSON.stringify(authKey) // Properly converting object to JSON string
    });
  }

  getMenuItems(): Observable<any> {
    const userMasterCode = this.authService.getUserMasterCode();
    const url = `${this._urlService.ERP_SIDE_MENU}/GetUserModuleMasterByUserID?UserID=${145}`;
    return this._http.get(url, { headers: this.headers() });
  }
}
