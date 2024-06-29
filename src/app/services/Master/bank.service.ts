import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { UrlService } from '../URL/url.service';
import { AuthService } from '../Auth-Service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class BankService{
  userCode:any
  obj:any

  authKey:any

  constructor(private _http: HttpClient, private _urlService: UrlService, private authService: AuthService) { }
    private headers(): HttpHeaders {
    this.authKey = this.authService.getAuthKey();
    this.obj = JSON.parse(this.authKey);
    this.userCode = this.obj.UserMaster_Code;

    return new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      'Auth-Key': ` ${this.authKey}`
    });
  }

  getPaymentList(code: any) {
    let url = this._urlService.API_ENDPOINT_BANK_MASTER + `/${code}`
    return this._http.get(url, { headers: this.headers()});
  }
  getecmsDropDown(code: any) {
    let url = this._urlService.API_ENDPOINT_BANK_MASTER + `/${code}`
    return this._http.get(url, { headers: this.headers() });
  }


  saveBank(payload: any): Observable<any> {
    let url = `${this._urlService.API_ENDPOINT_BANK_MASTER}/SaveBankMaster`;
    return this._http.post(url, JSON.stringify(payload), { headers: this.headers() });
  }


  
    
  
   deleteBank(code: number, reason: any) {
    // let url = this._urlService.API_ENDPOINT_BANK_MASTER + "/DeleteBankMaster" + `?code=${code}&${this.userCode}=13&ReasonForDelete=${reason}`;
   let url = this._urlService.API_ENDPOINT_BANK_MASTER + "/DeleteBankMaster" + `?code=${code}&UserMaster_Code=${this.userCode}&ReasonForDelete=${reason}&IPAddress=0&Location=0`;
   return this._http.post(url, '', { headers: this.headers() });
  }

  GetDebitAccountData(code: any) {
    let url = this._urlService.API_ENDPOINT_BANK_MASTER + `/${code}`
    return this._http.get(url, { headers: this.headers() });
  }


 
}
    
