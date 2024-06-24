// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class GodownService {

//   constructor() { }
// }




import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UrlService } from '../URL/url.service';
import { AuthService } from '../Auth-Service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class  GodownService{

  constructor(private _http: HttpClient, private _urlService: UrlService, private authService: AuthService) { }

  private headers = new HttpHeaders({
    'Content-Type': 'application/json; charset=utf-8',
    // 'Authorization': this.authservice.getAccessTokenNew()
  });


  getwarehouse(code: any) {
    let url = this._urlService.API_ENDPOINT_WARE_HOUSE + `/${code}`
    return this._http.get(url, { headers: this.headers });
  }
  getecmsDropDown(code: any) {
    let url = this._urlService.API_ENDPOINT_WARE_HOUSE+ `/${code}`
    return this._http.get(url, { headers: this.headers });
  }


  savewareHouses(payload: any): Observable<any> {
    let url = `${this._urlService.API_ENDPOINT_WARE_HOUSE}/SaveBankMaster`;
    return this._http.post(url, JSON.stringify(payload), { headers: this.headers });
  }


  
    
  
   deletwarehouse(code: number, reason: any) {
   let url = this._urlService.API_ENDPOINT_WARE_HOUSE + "/DeleteWarehouseMaster" + `?code=${code}&UserMaster_Code=13&ReasonForDelete=${reason}`;
    return this._http.post(url, '', { headers: this.headers });
  }

  GetDebitAccountData(code: any) {
    let url = this._urlService.API_ENDPOINT_BANK_MASTER + `/${code}`
    return this._http.get(url, { headers: this.headers });
  }


 
}