import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UrlService } from '../URL/url.service';
import { Observable } from 'rxjs';
import { AuthService } from '../Auth-Service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class TankConfigurationService {
  userCode: any;

  constructor(private _http: HttpClient, private _urlService: UrlService, private authService: AuthService) { }
  private headers(): HttpHeaders {
    // const authKey = this.authService.getAuthKey();
    // const abhi = JSON.parse(authKey);
    // const userMasterCode = this.authService.getUserMasterCode();
    // const obj1 = { ...abhi, userMasterCode };
    // this.userCode = obj1.UserMaster_Code;
    // const obj=JSON.stringify(obj1);
    // console.log("this.userCode--->", this.userCode);

    return new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      // 'Auth-Key': ` ${obj}`
    });
  }
  getTankConfigurationList(TankName: any): Observable<any> {
    let url = this._urlService.API_ENDPOINT_TankConfiguration + "/GetTankConfigurationList?TankName=" + `${TankName}`;
    return this._http.get(url);
  }
  getTank(): Observable<any> {
    let url = this._urlService.API_ENDPOINT_TankConfiguration + "/GetTankDespDropDown";
    return this._http.get<any>(url, {});
  }
  postTankConfiguration(obj: any[]): Observable<any> {
    const data = JSON.stringify(obj)
    // const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

    let url = this._urlService.API_ENDPOINT_TankConfiguration + "/SaveTankConfiguration";
    return this._http.post(url, data, { headers:this.headers()});
  }
}