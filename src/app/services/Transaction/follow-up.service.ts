import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UrlService } from '../URL/url.service';
import { Observable } from 'rxjs';
import { AuthService } from '../Auth-Service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class FollowUpService {
  userCode: any;

  constructor(private _http: HttpClient, private _urlService: UrlService, private authService: AuthService) { }

  private headers(): HttpHeaders {
    const authKey = this.authService.getAuthKey();
    return new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      'Auth-Key': JSON.stringify(authKey) // Properly converting object to JSON string
    });
  }

  getEnquiryFollowUpList(masterCode: any): Observable<any> {
    let url = this._urlService.API_ENDPOINT_ENQUIRYFOLLOWUP + "/GetEnquiryFollowUpList" + `?EnquiryMaster_Code=${masterCode}`;
    return this._http.get(url, { headers: this.headers() });
  }

  createFollowup(payload: object): Observable<any> {
    const data = {
      enquiryFollowUpList: [payload]
    };

    let url = `${this._urlService.API_ENDPOINT_ENQUIRYFOLLOWUP}/SaveEnquiryFollowUp?UserId=2`;
    return this._http.post(url, data, { headers: this.headers() });
  }

  deleteFollowup(code: number, reason: any): Observable<any> {
    const userMasterCode = this.authService.getUserMasterCode();
    let url = this._urlService.API_ENDPOINT_ENQUIRYFOLLOWUP + "/DeleteEnquiryFollowUp" + `?Code=${code}&UserId=${userMasterCode}&ReasonForDelete=${reason}`;
    return this._http.post(url, '', { headers: this.headers() });
  }

  followupDetailsByCode(code: number): Observable<any> {
    let url = this._urlService.API_ENDPOINT_ENQUIRYFOLLOWUP + "/" + `${code}`;
    return this._http.get(url, { headers: this.headers() });
  }

  getCustomerContactPersionName(enquiryMasterCode: number): Observable<any> {
    let url = this._urlService.API_ENDPOINT_ENQUIRYFOLLOWUP + "/GetEnquiryContactPersonDetailList" + `?EnquiryMaster_Code=${enquiryMasterCode}`;
    return this._http.get(url, { headers: this.headers() });
  }

  getCustomerNameAndFollowUpMode(enquiryMasterCode: number): Observable<any> {
    let url = this._urlService.API_ENDPOINT_ENQUIRYFOLLOWUP + "/GetEnquiryFollowUpMaxRecord" + `?EnquiryMaster_Code=${enquiryMasterCode}`;
    return this._http.get(url, { headers: this.headers() });
  }
}
