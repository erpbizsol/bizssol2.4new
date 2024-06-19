
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UrlService } from '../URL/url.service';
import { AuthService } from '../Auth-Service/auth.service';
// import { AuthService } from '../auth.service';



@Injectable({
  providedIn: 'root'
})
export class PaymetntTermService {
  userMasterCode: string;

  constructor(private _http: HttpClient, private _urlService: UrlService, private authService: AuthService) { }

  private headers(): HttpHeaders {
    const authKey = this.authService.getAuthKey();
    this.userMasterCode = this.authService.getUserMasterCode();
    return new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      'Auth-Key': `${authKey}`
    });
  }


  getPaymentList(code: any) {
    let url = this._urlService.API_ENDPOINT_PAYMENT_TERMS_MASTER + `/${code}`
    return this._http.get(url, { headers: this.headers() });
  }


  savePayment(payload: any): Observable<any> {
    let url = `${this._urlService.API_ENDPOINT_PAYMENT_TERMS_MASTER}/SavePaymentTermsMaster`;
    return this._http.post(url, payload, { headers: this.headers() });
  }



  updatePayMent(payload: any): Observable<any> {
    // const data = {
    //   paymentListUpList: [payload]
    // };


    let url = `${this._urlService.API_ENDPOINT_PAYMENT_TERMS_MASTER}/SavePaymentTermsMaster`;
    return this._http.post(url, payload, { headers: this.headers() });
  }

  deletePaymentList(code: number, reason: any) {
    let url = this._urlService.API_ENDPOINT_PAYMENT_TERMS_MASTER + "/DeletePaymentTermsMaster" + `?code=${code}&UserMaster_Code=${this.userMasterCode}&ReasonForDelete=${reason}`;
    return this._http.post(url, '', { headers: this.headers() });
  }


  getCustomerNameAndFollowUpMode(enquiryMasterCode: number) {
    let url = this._urlService.API_ENDPOINT_ENQUIRYFOLLOWUP + "/GetEnquiryFollowUpMaxRecord" + `?EnquiryMaster_Code=${enquiryMasterCode}`;
    return this._http.get(url, { headers: this.headers() });
  }
}
