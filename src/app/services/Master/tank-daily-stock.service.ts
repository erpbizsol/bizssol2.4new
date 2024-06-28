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
  getTankMasterDropdownList(): Observable<any> {
    let url = this._urlService.API_ENDPOINT_TankConfiguration + "/GetTankDespDropDown";
    return this._http.get<any>(url, {});
  }
  // getTankDailyStockList(TankName: any): Observable<any> {
  //   let url = this._urlService.API_ENDPOINT_TankConfiguration + "/getTankDailyStockList?TankName=" + `${TankName}`;
  //   return this._http.get(url);
  // }

  getCalculateStockQty(TankName:any,Level:any):Observable<any>{
    let url = this._urlService.API_ENDPOINT_TankDailyStock+ "/GetCalculateStockQTY?TankName="+`${TankName}`+'&Level='+`${Level}`;
    return this._http.get(url);
  }

  GetDailyTankStockMasterByDate(date:string):Observable<any>{
    let url = this._urlService.API_ENDPOINT_TankDailyStock+ "/GetDailyTankStockMasterByDate?Date="+`${date}`;
    return this._http.get(url);
  }

getDailyTankTotalDispatch():Observable<any>{
  let url = this._urlService.API_ENDPOINT_TankDailyStock+ "/GetTotalDispatch="+``;
  return this._http.get(url);
}

  postTankDailyStock(Obj: any): Observable<any> {
    const data = JSON.stringify(Obj)
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    let url = this._urlService.API_ENDPOINT_TankDailyStock + "/SaveDailyTankStockMaster";
    return this._http.post(url, data, { headers: this.headers });
  }
}
