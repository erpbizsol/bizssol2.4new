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
    this.userCode = this.authService.getUserMasterCode();

  
    return new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      'Auth-Key':`${authKey}`
    });
  }

  getCategorylist(formtype:any): Observable<any> {
    let url = this._urlService.API_ENDPOINT_CATEGORY + `/GetCategoryMasterList?FormType=${formtype}`;
    return this._http.get(url, { headers: this.headers() });
  }

  saveCategory(obj: any) {
    // let data = JSON.stringify(obj)
    let url = this._urlService.API_ENDPOINT_CATEGORY + "/SaveCategoryMaster";
    return this._http.post(url, obj, { headers: this.headers() });
  }
  updateCategory(code: any) {
    let url = this._urlService.API_ENDPOINT_CATEGORY + `/${code}`;
    return this._http.get(url, { headers: this.headers() });
  }
  deleteCategory(code: any, reason: any) {
    let url = this._urlService.API_ENDPOINT_CATEGORY + "/DeleteCategoryMaster" + `?code=${code}&UserMaster_Code=${this.userCode}&ReasonForDelete=${reason} + &IPAddress=1&Location=1`;
    return this._http.post(url, { headers: this.headers });
  }

}
