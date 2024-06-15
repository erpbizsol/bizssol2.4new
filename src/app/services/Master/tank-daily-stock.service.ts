import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UrlService } from '../URL/url.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TankDailyStockService {
  constructor(private _http: HttpClient, private _urlService: UrlService) { }
  private headers = new HttpHeaders({
    'Content-Type': 'application/json; charset=utf-8',
    // 'Authorization': this.authservice.getAccessTokenNew()
  });
  getTankMasterDropdownList(obj:any): Observable<any> {
    let url = this._urlService.API_ENDPOINT_Dropdown + "/GetDropdownList";
    return this._http.post<any>(url, JSON.stringify(obj), { headers: this.headers });
  }
  getTankDailyStockList(TankName: any): Observable<any> {
    let url = this._urlService.API_ENDPOINT_TankConfiguration + "/getTankDailyStockList?TankName=" + `${TankName}`;
    return this._http.get(url);
  }

  getCalculateStockQty(TankName:any,Level:any):Observable<any>{
    let url = this._urlService.API_ENDPOINT_TankDailyStock + "/GetCalculateStockQTY?TankName="+`${TankName}`+'&Level='+`${Level}`;
    return this._http.get(url);
  }
}
