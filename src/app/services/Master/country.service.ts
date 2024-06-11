import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UrlService } from '../URL/url.service';
import { Observable } from 'rxjs';
import { AuthService } from '../Auth-Service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  userCode: any;

  constructor(private _http: HttpClient, private _urlService: UrlService, private authService: AuthService) { }

  private headers(): HttpHeaders {
    const authKey = this.authService.getAuthKey();

    const abhi = JSON.parse(authKey);
    const obj = { ...abhi, UserMaster_Code: 13 };
    this.userCode = obj.UserMaster_Code;
    console.log("this.userCode--->", this.userCode);
    // console.log(JSON.stringify(obj));

    return new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      'Auth-Key': ` ${obj}`
    });
  }

  getCountry(): Observable<any> {
    let url = this._urlService.API_ENDPOINT_COUNTRY + "/GetCountryMasterList";
    return this._http.get(url, { headers: this.headers() });
  }

  saveCountry(obj: any) {
    // let data = JSON.stringify(obj)
    let url = this._urlService.API_ENDPOINT_COUNTRY + "/SaveCountryMaster";
    return this._http.post(url, obj, { headers: this.headers() });
  }
  updateCountry(code: any) {
    let url = this._urlService.API_ENDPOINT_COUNTRY + `/${code}`;
    return this._http.get(url, { headers: this.headers() });
  }
  deleteCountry(code: any, reason: any) {
    let url = this._urlService.API_ENDPOINT_COUNTRY + "/DeleteCountryMaster" + `?code=${code}&UserMaster_Code=${this.userCode}&ReasonForDelete=${reason}`;
    return this._http.post(url, { headers: this.headers });
  }

}
