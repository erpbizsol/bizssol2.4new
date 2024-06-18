import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UrlService } from '../URL/url.service';
import { AuthService } from '../Auth-Service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoutePlanService {
  userCode: any;

  constructor(private _http: HttpClient, private _urlService: UrlService, private authService: AuthService) { }

  private headers(): HttpHeaders {
    const authKey = this.authService.getAuthKey();
    const userMasterCode = this.authService.getUserMasterCode();
    const headersConfig: { [key: string]: string } = {
      'Content-Type': 'application/json; charset=utf-8',
      'Auth-Key': authKey || ''
    };
    if (userMasterCode) {
      headersConfig['UserMaster-Code'] = userMasterCode;
    }
    return new HttpHeaders(headersConfig);
  }

  getRoutePlanMasterList(): Observable<any> {
    const userMasterCode = this.authService.getUserMasterCode();
    let url = this._urlService.API_ENDPOINT_ROUTE_PLAN + "/GetUserWiseRoutePlanDetails" + `?UserMaster_Code=${userMasterCode}`;
    return this._http.get(url, { headers: this.headers() });
  }

  verifyAllRoutePlan(codes: any[]): Observable<any> {
    const userMasterCode = this.authService.getUserMasterCode();
    const codesString = codes.join(',');
    let url = `${this._urlService.API_ENDPOINT_ROUTE_PLAN}/VerifyAllRoutePlan?MultiRoutePlanCodes=${codesString}&UserMaster_Code=${userMasterCode}`;
    return this._http.post(url, {}, { headers: this.headers() });
  }
  verifyRoutePlan(code: any): Observable<any> {
    const userMasterCode = this.authService.getUserMasterCode();
    let url = `${this._urlService.API_ENDPOINT_ROUTE_PLAN}/VerifyRoutePlan?Code=${code}&UserMaster_Code=${userMasterCode}`;
    return this._http.post(url, {}, { headers: this.headers() });
  }
  rejectAllRoutePlan(codes: any[], reason: any) {
    const userMasterCode = this.authService.getUserMasterCode();
    const codesString = codes.join(',');
    let url = this._urlService.API_ENDPOINT_ROUTE_PLAN + "/RejectAllRoutePlan" + `?MultiRoutePlanCodes=${codesString}&UserMaster_Code=${userMasterCode}&ReasonForDelete=${reason}`;
    return this._http.post(url, { reason }, { headers: this.headers() });
  }
  rejectRoutePlan(code: number, reason: any) {
    const userMasterCode = this.authService.getUserMasterCode();
    let url = this._urlService.API_ENDPOINT_ROUTE_PLAN + "/RejectRoutePlan" + `?Code=${code}&UserMaster_Code=${userMasterCode}&ReasonForDelete=${reason}`;
    return this._http.post(url, { reason }, { headers: this.headers() });
  }

  // Route Plan integrate service
  getRoutePlanList(PlanDate: any): Observable<any> {
    const userMasterCode = this.authService.getUserMasterCode();
    let url = this._urlService.API_ENDPOINT_ROUTE_PLAN + "/GetRoutePlanListByPlanDate" + `?Date=${PlanDate}&UserMaster_Code=${userMasterCode}`;
    return this._http.get(url, { headers: this.headers() });
  }

  // Visit type 
  getRoutePlanVistTypeDropDownList(): Observable<any> {
    // let url = this._urlService.API_ENDPOINT_ROUTE_PLAN + "/RoutePlanVistTypeDropDownList" + `?Code=${code}&Desp${Desp}&ExtraValue=${""}`;
    let url = this._urlService.API_ENDPOINT_ROUTE_PLAN + "/RoutePlanVistTypeDropDownList";
    return this._http.get(url, { headers: this.headers() });
  }

  // getAccountMasterDetails(UserMaster_Code:any): Observable<any>
  getAccountMasterDetails(): Observable<any>  {
    const userMasterCode = this.authService.getUserMasterCode();
    // let url = this._urlService.API_ENDPOINT_ACCOUNT_MASTER + "/GetNestedDealerList?UserMaster_Code=1&MarketingManMaster_Code=0";
    let url = this._urlService.API_ENDPOINT_ACCOUNT_MASTER + "/GetNestedDealerList" + `?UserMaster_Code=${userMasterCode}&MarketingManMaster_Code=0`;
    return this._http.get(url, { headers: this.headers() });
  }

  //SAVE ROUTE PLAN 
  postSaveRoutePlan(payload:any): Observable<any> {
    let url = this._urlService.API_ENDPOINT_ROUTE_PLAN + "/SaveRoutePlan";
    console.log(url,payload)

    return this._http.post(url,payload, {headers: this.headers() });
  }

  
}
