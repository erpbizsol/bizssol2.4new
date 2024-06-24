import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UrlService } from '../URL/url.service';
import { Observable } from 'rxjs';
import { state } from '@angular/animations';
import { AuthService } from '../Auth-Service/auth.service';
@Injectable({
  providedIn: 'root'
})
export class CityService {
  userMaster_Code: string;

  constructor(private _http: HttpClient, private _urlService: UrlService, private authService: AuthService) { }

  private headers(): HttpHeaders {
    const authKey = this.authService.getAuthKey();
    this.userMaster_Code=this.authService.getUserMasterCode();
    return new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      'Auth-Key': ` ${authKey}`    });
  }

  getCityList(statename: any): Observable<any> {
    let url = this._urlService.API_ENDPOINT_CITY + "/GetCityList?StateName=" + `${statename}`;
    return this._http.get(url, { headers: this.headers() });
  }
  saveCity(object: any) {
    let data = JSON.stringify(object)
    let url = this._urlService.API_ENDPOINT_CITY + "/SaveCityMaster";
    return this._http.post(url, data, { headers: this.headers() });
  }


  deleteCity(code: any,reason:any) {

    let url = this._urlService.API_ENDPOINT_CITY + "/DeleteCityMaster" + `?Code=${code}&UserMaster_Code=${this.userMaster_Code}&ReasonForDelete=${reason}`;
    return this._http.post(url, { headers: this.headers });
  }

  // ---------------->Abhishek<---------------------
  getCity(StateName: string): Observable<any> {
    let url = this._urlService.API_ENDPOINT_CITY + "/GetCityList?StateName=" + StateName;
    return this._http.get(url, { headers: this.headers() });
  }
}