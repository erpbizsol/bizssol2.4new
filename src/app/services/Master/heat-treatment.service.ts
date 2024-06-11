import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UrlService } from '../URL/url.service';
import { Observable } from 'rxjs';
import { AuthService } from '../Auth-Service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class HeatTreatmentService {
  userCode: any;

  constructor(private _http: HttpClient, private _urlService: UrlService, private authService: AuthService) { }

  private headers(): HttpHeaders {
    const authKey = this.authService.getAuthKey();
    const abhi = JSON.parse(authKey);
    const userMasterCode = this.authService.getUserMasterCode();
    const obj = { ...abhi, userMasterCode };
    this.userCode = obj.UserMaster_Code;
    console.log("this.userCode--->", this.userCode);
    // console.log(JSON.stringify(obj));

    return new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      'Auth-Key': ` ${obj}`
    });
  }
  
  // integrate service
  // processList(): Observable<any>{
  //   let url = this._urlService.API_ENDPOINT_HEATTREATMENT + '/GetHeatTreatmentDropDownList?EntryType=Plan&ListFor=GET_PROCESSLIST&Code=0&EntryDate=""';
  //   return this._http.post(url, {}, { headers: this.headers });
  // }

  // machineNo(): Observable<any>{
  //   let url = this._urlService.API_ENDPOINT_HEATTREATMENT + '/GetHeatTreatmentDropDownList?EntryType=Plan&ListFor=GET_MACHINELIST &Code=0&EntryDate=""';
  //   return this._http.post(url, {}, { headers: this.headers });
  // }
  
  // postHeatTreatment(): Observable<any> {
  //   let url = this._urlService.API_ENDPOINT_HEATTREATMENT + '/GetHeatTreatmentDropDownList?EntryType=Plan&ListFor=GET_WORKORDERNOLIST&code=0&EntryDate=""';
  //   return this._http.post(url, {}, { headers: this.headers });
  // }

  // OR 
  GetHeatTreatmentDropDownList(EntryType,ListFor,code,EntryDate):Observable<any> {
    let url = this._urlService.API_ENDPOINT_HEATTREATMENT + '/GetHeatTreatmentDropDownList?EntryType='+EntryType+'&ListFor='+ListFor+'&code='+code+'&EntryDate=""';
    return this._http.post(url, {}, { headers: this.headers() });
  }


  // http://localhost:5088/api/HeatTreatment/GetHeatTreatmentDropDownList?EntryType=Plan&ListFor=GET_MACHINELIST &Code%20=0&EntryDate="
  // GetHeatTreatmentDropDownList(obj:any):Observable<any> {
  //   let url = this._urlService.API_ENDPOINT_HEATTREATMENT + '/GetHeatTreatmentDropDownList?EntryType='+"EntryType"+`${obj.EntryType}`+"ListFor"+`${obj.ListFor}`+"code"+`${obj.Code}`+"EntryDate"+'';
  //   return this._http.post(url, {}, { headers: this.headers });
  // }
}
