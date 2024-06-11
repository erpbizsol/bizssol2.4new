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
    debugger
    const authKey = this.authService.getAuthKey();
    const userMasterCode = this.authService.getUserMasterCode();
    const headersConfig: { [key: string]: string } = {
      'Content-Type': 'application/json; charset=utf-8',
      'Auth-Key': authKey || ''
    };
    if (userMasterCode) {
      headersConfig['UserMaster-Code'] = userMasterCode;
    }
    return new HttpHeaders(headersConfig);
  }

  getMenuItems(): Observable<any> {
    debugger
    const userMasterCode = this.authService.getUserMasterCode();
    const url = `${this._urlService.ERP_SIDE_MENU}/GetUserModuleMasterByUserID?UserID=${userMasterCode}`;
    return this._http.get(url, { headers: this.headers() });
  }
}
