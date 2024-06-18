import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UrlService } from '../URL/url.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HSNCodeMasterService {
  constructor(private _http: HttpClient, private _urlService: UrlService) { }
  private headers = new HttpHeaders({
    'Content-Type': 'application/json; charset=utf-8',
    // 'Authorization': this.authservice.getAccessTokenNew()
  });
  getHSNCodeMaterList(): Observable<any> {
    let url = this._urlService.API_ENDPOINT_HSNCodeMaster + "/GetHSNCodeMaterList";
    return this._http.get(url);
  }
  getTankDailyStockList(TankName: any): Observable<any> {
    let url = this._urlService.API_ENDPOINT_HSNCodeMaster + "/getTankDailyStockList?TankName=" + `${TankName}`;
    return this._http.get(url);
  }

  getCalculateStockQty(TankName:any,Level:any):Observable<any>{
    let url = this._urlService.API_ENDPOINT_HSNCodeMaster+ "/GetCalculateStockQTY?TankName="+`${TankName}`+'&Level='+`${Level}`;
    return this._http.get(url);
  }

  // deleteUOM(code: number, reason: any): Observable<any> {
  //   let url = this._urlService.API_ENDPOINT_UOM + "/DeleteUOMMaster?Code=" + code + `&UserMaster_Code=${this.userCode}&ReasonForDelete=${reason}`;
  //   return this._http.post(url, '', { headers: this.headers() });
  // }
  saveHSNCode(hsnCodeData: any): Observable<any> {
    // const data = JSON.stringify(Obj)
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    let url = this._urlService.API_ENDPOINT_HSNCodeMaster+ "/SaveHSNCodeMaster";
    // return this._http.post(url, data, { headers: this.headers() });
    return this._http.post<any>(url, hsnCodeData);
  }
}
