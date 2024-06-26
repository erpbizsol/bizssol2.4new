import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UrlService } from '../URL/url.service';
import { Observable } from 'rxjs';
import { AuthService } from '../Auth-Service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class SubcategoryService {
  userCode: any;

  constructor(private _http: HttpClient, private _urlService: UrlService, private authService: AuthService) { }

  private headers(): HttpHeaders {
    const authKey = this.authService.getAuthKey();
    this.userCode = this.authService.getUserMasterCode();

  
    return new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
    });
  }

  getSubCategorylist(): Observable<any> {
    let url = this._urlService.API_ENDPOINT_SUBCATEGORY + "/GetSubCategoryMasterList?FormType=s";
    return this._http.get(url, { headers: this.headers() });
  }

  saveSubCategory(obj: any) {
    // let data = JSON.stringify(obj)
    let url = this._urlService.API_ENDPOINT_SUBCATEGORY + "/SaveSubCategoryMaster";
    return this._http.post(url, obj, { headers: this.headers() });
  }
  updateSubCategory(code: any) {
    let url = this._urlService.API_ENDPOINT_SUBCATEGORY + `/${code}`;
    return this._http.get(url, { headers: this.headers() });
  }
  deleteSubCategory(code: any, reason: any) {
    let url = this._urlService.API_ENDPOINT_SUBCATEGORY + "/DeleteSubCategoryMaster" + `?Code=${code}&UserMaster_Code=${this.userCode}&ReasonForDelete=${reason} + &IPAddress=1&Location=1`;
    return this._http.post(url, { headers: this.headers });
  }

}
