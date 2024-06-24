import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UrlService } from '../URL/url.service';
import { Observable } from 'rxjs';
import { AuthService } from '../Auth-Service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  userMaster_Code: string;

  constructor(private _http: HttpClient, private _urlService: UrlService, private authService: AuthService) { }

  private headers(): HttpHeaders {
    const authKey = this.authService.getAuthKey();
    this.userMaster_Code = this.authService.getUserMasterCode();
    return new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      'Auth-Key': ` ${authKey}`    });
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
    let url = this._urlService.API_ENDPOINT_COUNTRY + "/DeleteCountryMaster" + `?code=${code}&UserMaster_Code=${this.userMaster_Code}&ReasonForDelete=${reason}`;
    return this._http.post(url, { headers: this.headers });
  }

}
