import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { UrlService } from '../URL/url.service';
import { Observable } from 'rxjs';
import { AuthService } from '../Auth-Service/auth.service';
@Injectable({
  providedIn: 'root'
})
export class ChemicalService {
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
  getChemicalList(){
    let url = this._urlService.API_ENDPOINT_CHEMICAL + `/GetChemicalMasterList`
    return this._http.get(url, { headers: this.headers() });

  }
  saveChemical(payload: any): Observable<any> {
   
    let url = `${this._urlService.API_ENDPOINT_CHEMICAL}/SaveChemicalMaster`;
    return this._http.post(url, payload, { headers: this.headers() });
  }
  deleteChemicalList(code: number, reason: any) {
    let url = this._urlService.API_ENDPOINT_CHEMICAL + "/DeleteChemicalMaster" + `?code=${code}&UserMaster_Code=13&ReasonForDelete=${reason}`;
     return this._http.post(url, '', { headers: this.headers() });
   }
}
