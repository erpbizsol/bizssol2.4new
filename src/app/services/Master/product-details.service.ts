import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UrlService } from '../URL/url.service';
import { Observable } from 'rxjs';
import { AuthService } from '../Auth-Service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProductDetailsService {
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


  getProduct(): Observable<any> {
    let url = this._urlService.API_ENDPOINT_PRODUCT + '/GetItemMasterDropDown';
    return this._http.get(url);
  }

  postProductDetails(Obj: Object): Observable<any> {
    const data = JSON.stringify(Obj)
    let url = this._urlService.API_ENDPOINT_ENQUIRY + "/SaveEnquiryMaster";
    return this._http.post(url, Obj);
  }

  getSpecification(param:any): Observable<any> {
    let url = this._urlService.API_ENDPOINT_SPECIFICATION + '/GetItemSizeMasterList' + `?ItemName=${param}`;
    return this._http.get(url);
  }

  getUOM(): Observable<any> {
    let url = this._urlService.API_ENDPOINT_UOM + '/GetUOMMasterList';
    return this._http.get(url);
  }



}
