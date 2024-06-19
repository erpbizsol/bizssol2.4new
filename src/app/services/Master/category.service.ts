import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UrlService } from '../URL/url.service';
import { Observable } from 'rxjs';
import { AuthService } from '../Auth-Service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  userCode: any;

  constructor(private _http: HttpClient, private _urlService: UrlService, private authService: AuthService) { }

  private headers(): HttpHeaders {
    const authKey = this.authService.getAuthKey();

  
    return new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
    });
  }

  getCategory(): Observable<any> {
    let url = this._urlService.API_ENDPOINT_CATEGORY + "/GetCountryMasterList";
    return this._http.get(url, { headers: this.headers() });
  }

  saveCategory(obj: any) {
    // let data = JSON.stringify(obj)
    let url = this._urlService.API_ENDPOINT_CATEGORY + "/SaveCountryMaster";
    return this._http.post(url, obj, { headers: this.headers() });
  }
  updateCategory(code: any) {
    let url = this._urlService.API_ENDPOINT_CATEGORY + `/${code}`;
    return this._http.get(url, { headers: this.headers() });
  }
  deleteCategory(code: any, reason: any) {
    let url = this._urlService.API_ENDPOINT_CATEGORY + "/DeleteCountryMaster" + `?code=${code}&UserMaster_Code=${this.userCode}&ReasonForDelete=${reason}`;
    return this._http.post(url, { headers: this.headers });
  }

}
