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
    const key = JSON.parse(authKey);
    const userMasterCode = this.authService.getUserMasterCode();
    const obj = { ...key, userMasterCode };
    this.userCode = obj.UserMaster_Code;
    console.log("this.userCode--->", this.userCode);

    return new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      'Auth-Key': ` ${obj}`
    });
  }


  getRoutePlanMasterList(): Observable<any> {
    debugger
    let url = this._urlService.API_ENDPOINT_ROUTE_PLAN + "/GetUserWiseRoutePlanDetails" + `?UserMaster_Code=${this.userCode}`;
    return this._http.get(url, { headers: this.headers() });
  }

  verifyAllRoutePlan(codes: any[]): Observable<any> {
    const codesString = codes.join(',');
    let url = `${this._urlService.API_ENDPOINT_ROUTE_PLAN}/VerifyAllRoutePlan?MultiRoutePlanCodes=${codesString}&UserMaster_Code=${this.userCode}`;
    return this._http.post(url, {}, { headers: this.headers() });
  }
  verifyRoutePlan(code: any): Observable<any> {
    let url = `${this._urlService.API_ENDPOINT_ROUTE_PLAN}/VerifyRoutePlan?Code=${code}&UserMaster_Code=${this.userCode}`;
    return this._http.post(url, {}, { headers: this.headers() });
  }
  rejectAllRoutePlan(codes: any[], reason: any) {
    const codesString = codes.join(',');
    let url = this._urlService.API_ENDPOINT_ROUTE_PLAN + "/RejectAllRoutePlan" + `?MultiRoutePlanCodes=${codesString}&UserMaster_Code=${this.userCode}&ReasonForDelete=${reason}`;
    return this._http.post(url, { reason }, { headers: this.headers() });
  }
  rejectRoutePlan(code: number, reason: any) {
    let url = this._urlService.API_ENDPOINT_ROUTE_PLAN + "/RejectRoutePlan" + `?Code=${code}&UserMaster_Code=${this.userCode}&ReasonForDelete=${reason}`;
    return this._http.post(url, { reason }, { headers: this.headers() });
  }

  // integrate service

  getRoutePlanList(PlanDate, UserMaster_Code): Observable<any> {
    let url = this._urlService.API_ENDPOINT_ROUTE_PLAN + "/GetRoutePlanListByPlanDate" + `?Date=${PlanDate}&UserMaster_Code=${UserMaster_Code}`;
    return this._http.get(url, { headers: this.headers() });
  }

}
