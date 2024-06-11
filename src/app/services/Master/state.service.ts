import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UrlService } from '../URL/url.service';
import { Observable } from 'rxjs';
import { AuthService } from '../Auth-Service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  userCode: any;

  constructor(private _http: HttpClient, private _urlService: UrlService, private authService: AuthService) { }

  private headers(): HttpHeaders {
    const authKey = this.authService.getAuthKey();
    const abhi = JSON.parse(authKey);
    const userMasterCode = this.authService.getUserMasterCode();
    const obj = { ...abhi, userMasterCode };
    this.userCode = obj.UserMaster_Code;
    console.log("this.userCode--->", this.userCode);

    return new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      'Auth-Key': ` ${obj}`
    });
  }

  // getStates(countryName: any): Observable<any> {
  //   let url = this._urlService.API_ENDPOINT_STATE + "/GetStateList" + `?CountryName=${countryName}`;
  //   return this._http.get(url, { headers: this.headers });
  // }


  getStatesList(countryname: any): Observable<any> {
    let url = this._urlService.API_ENDPOINT_STATE + "/GetStateList" + `?CountryName=${countryname}`;
    // let url = this._urlService.API_ENDPOINT_STATE + "/GetStateList" + `?CountryName=India`;
    return this._http.get(url, { headers: this.headers() });
  }

  // /GetStateList?
  saveState(object: any) {
    let data = JSON.stringify(object)
    let url = this._urlService.API_ENDPOINT_STATE + "/SaveStateMaster";
    return this._http.post(url, data, { headers: this.headers() });
  }

  deleteState(code: any, reason: any) {
    let url = this._urlService.API_ENDPOINT_STATE + "/DeleteStateMaster" + `?Code=${code}&UserMaster_Code=${this.userCode}&ReasonForDelete=${reason}`;
    return this._http.post(url, { headers: this.headers() });
  }


  // ---------------->Abhishek<---------------------
  getStates(countryName: any): Observable<any> {
    let url = this._urlService.API_ENDPOINT_STATE + "/GetStateList" + `?CountryName=${countryName}`;
    return this._http.get(url, { headers: this.headers() });
  }
}


