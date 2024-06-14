import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { UrlService } from '../URL/url.service';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ChemicalService {

  constructor(private _http:HttpClient,private _urlService:UrlService) { }

  private headers=new HttpHeaders({
    'Content-Type': 'application/json; charset=utf-8',
  });
  getChemicalList(code: any) {
    let url = this._urlService.API_ENDPOINT_CHEMICAL+ `/${code}`
    return this._http.get(url, { headers: this.headers });
   

  }


  saveChemical(payload: any): Observable<any> {
    let url = `${this._urlService.API_ENDPOINT_CHEMICAL}/SavePaymentTermsMaster`;
    return this._http.post(url, payload, { headers: this.headers });
  }

  
    updatePayMent(payload: any): Observable<any> {  
      let url = `${this._urlService.API_ENDPOINT_CHEMICAL}/SavePaymentTermsMaster`;
      return this._http.post(url, payload, { headers: this.headers });
    }
  
    deleteChemicalList(code: number, reason: any) {
   let url = this._urlService.API_ENDPOINT_CHEMICAL + "/DeletePaymentTermsMaster" + `?code=${code}&UserMaster_Code=13&ReasonForDelete=${reason}`;
    return this._http.post(url, '', { headers: this.headers });
  }
}
