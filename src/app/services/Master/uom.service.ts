import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UrlService } from '../URL/url.service';
import { AuthService } from '../Auth-Service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UomService {
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
  getUOM(): Observable<any> {
    let url = this._urlService.API_ENDPOINT_UOM + "/GetUOMMasterList";
    return this._http.get(url, { headers: this.headers() });
  }
  getGSTUOMDesp(obj: any): Observable<any> {
    let url = this._urlService.API_ENDPOINT_Dropdown + "/GetDropdownList";
    return this._http.post<any>(url, obj);
  }
  editUOM(Code: number): Observable<any> {
    console.log("UOM",);
    let url = this._urlService.API_ENDPOINT_UOM + "/" + `${Code}`;
    return this._http.get(url, { headers: this.headers() });
  }
  deleteUOM(code: number, reason: any): Observable<any> {
    let url = this._urlService.API_ENDPOINT_UOM + "/DeleteUOMMaster?Code=" + code + `&UserMaster_Code=${this.userCode}&ReasonForDelete=${reason}`;
    return this._http.post(url, '', { headers: this.headers() });
  }
  postUOM(Obj: any): Observable<any> {
    const data = JSON.stringify(Obj)
    // const headers = new HttpHeaders().set('Content-Type', 'application/json');     
    let url = this._urlService.API_ENDPOINT_UOM + "/SaveUOMMaster";
    return this._http.post(url, data, { headers: this.headers() });
  }
}
