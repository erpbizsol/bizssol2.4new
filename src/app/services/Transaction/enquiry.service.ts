import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UrlService } from '../URL/url.service';
import { Observable } from 'rxjs';
import { AuthService } from '../Auth-Service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class EnquiryService {

  constructor(private _http: HttpClient, private _urlService: UrlService, private authService: AuthService) { }

  // private headers = new HttpHeaders({
  //   'Content-Type': 'application/json; charset=utf-8',
  //   'Authorization': this.authService.getAuthKey()
  // });

  userMasterCode: string;
  private headers(): HttpHeaders {
    const authKey = this.authService.getAuthKey();
    return new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      'Auth-Key': JSON.stringify(authKey)
    });
  }

  getEnquiry(param: any): Observable<any> {
    let url = this._urlService.API_ENDPOINT_ENQUIRY + "/GetEnquiryMasterList" + `?MarketingManPerson=${param}`;
    return this._http.get(url, { headers: this.headers() });
  }

  postEnquiry(Obj: Object): Observable<any> {
    console.log("object", Obj);
    let url = this._urlService.API_ENDPOINT_ENQUIRY + "/SaveEnquiryMaster";
    return this._http.post(url, Obj, { headers: this.headers() });
  }

  GetEnquiryDetailsByCode(code: number): Observable<any> {
    let url = this._urlService.API_ENDPOINT_ENQUIRY + "/GetEnquiryDetailsByCode" + `?Code=${code}`;
    return this._http.get(url);
  }

  deleteEnquiry(code: number, reason: any): Observable<any> {
    let url = this._urlService.API_ENDPOINT_ENQUIRY + "/DeleteEnquiryMaster" + `?Code=${code}&UserMaster_Code=${this.userMasterCode}&ReasonForDelete=${reason}`;
    return this._http.post(url, { headers: this.headers() });
  }

  deleteContactPersionDetails(code: any, reason: any) {
    this.userMasterCode = this.authService.getUserMasterCode();
    const url = this._urlService.API_ENDPOINT_ENQUIRY + '/DeleteEnquiryContactDetail' + `?Code=${code}` + `&UserMaster_Code=${this.userMasterCode}` + `&ReasonForDelete=${reason}`;
    return this._http.post(url, { headers: this.headers() });
  }
  deleteProductDetails(code: any, reason: any) {
    this.userMasterCode = this.authService.getUserMasterCode();
    const url = this._urlService.API_ENDPOINT_ENQUIRY + '/DeleteEnquiryProductDetail' + `?Code=${code}` + `&UserMaster_Code=${this.userMasterCode}` + `&ReasonForDelete=${reason}`;
    return this._http.post(url, { headers: this.headers() });
  }

  pincode(pin: any): Observable<any> {
    let url = this._urlService.API_ENDPOINT_ENQUIRY + "/GetPinCodeDetails" + `?PinCode=${pin}`;
    return this._http.get(url);
  }

  leadSource(): Observable<any> {
    const url = this._urlService.API_ENDPOINT_LEADSOURCE + '/GetLeadSourceList';
    return this._http.get(url);
  }

  salePerson(): Observable<any> {
    const url = this._urlService.API_ENDPOINT_SALESPERSON + '/GetNestedMarketingManList';
    return this._http.get(url);
  }

  assignDetails(code: number, marketingPersonMasterCode: any): Observable<any> {
    const url = this._urlService.API_ENDPOINT_ENQUIRY + '/EnquiryAssignPersonDetail' + `?EnquiryMaster_Code=${code}&MarketingPersonMaster_Code=${marketingPersonMasterCode}&UserMaster_Code=${this.userMasterCode}`;
    return this._http.post(url, { headers: this.headers });
  }
  verifyDetails(enquiryCode: number, remarks: string): Observable<any> {
    const url = this._urlService.API_ENDPOINT_ENQUIRY + '/EnquiryVerifyDetail' + `?Code=${enquiryCode}&UserMaster_Code=${this.userMasterCode}` + `&ReasonForVerify=${remarks}`;;
    return this._http.post(url, { headers: this.headers() });
  }
  rejectDetails(enquiryCode: number, remarks: any): Observable<any> {
    const url = this._urlService.API_ENDPOINT_ENQUIRY + '/EnquiryReject' + `?Code=${enquiryCode}&UserMaster_Code=${this.userMasterCode}` + `&ReasonForReject=${remarks}`;
    return this._http.post(url, { headers: this.headers() });
  }
  enquiryClosed(enquiryCode: any, remark: any) {
    this.userMasterCode = this.authService.getUserMasterCode();
    const url = this._urlService.API_ENDPOINT_ENQUIRY + '/EnquiryClosed' + `?EnquiryMaster_Code=${enquiryCode}` + `&UserMaster_Code=${this.userMasterCode}` + `&Remark=${remark}`;
    return this._http.post(url, { headers: this.headers() });
  }
  enquiryApproved(enquiryCode: any, remark: any, status: string) {
    this.userMasterCode = this.authService.getUserMasterCode();
    const url = this._urlService.API_ENDPOINT_ENQUIRY + '/EnquiryApproved' + `?EnquiryMaster_Code=${enquiryCode}` + `&UserMaster_Code=${this.userMasterCode}` + `&Remark=${remark}` + `&ApprovedStatus=${status}`;
    return this._http.post(url, { headers: this.headers() });
  }
  enquiryReOpen(enquiryCode: any, remark: any) {
    this.userMasterCode = this.authService.getUserMasterCode();
    const url = this._urlService.API_ENDPOINT_ENQUIRY + '/EnquiryReOpen' + `?EnquiryMaster_Code=${enquiryCode}` + `&UserMaster_Code=${this.userMasterCode}` + `&Remark=${remark}`;
    return this._http.post(url, { headers: this.headers() });
  }

  CheckDuplicateEnquiryContactDetail(param) {
    const personCode = param.contactPersonsList[0].Code
    if (personCode === undefined) {
      const Obj = {
        EnquiryMaster_Code: param.contactPersonsList[0].EnquiryMaster_Code,
        Code: 0,
        MobileNO: param.contactPersonsList[0].contactPersonMobile,
        Email: param.contactPersonsList[0].contactPersonEMail,
      }
      const url = this._urlService.API_ENDPOINT_ENQUIRY + "/CheckDuplicateEnquiryContactDetail" + `?EnquiryMaster_Code=${Obj.EnquiryMaster_Code}&MobileNO=${Obj.MobileNO}&Email=${Obj.Email}&Code=${JSON.stringify(Obj.Code)}`;
      return this._http.post(url, { headers: this.headers() });
    }
    else if (String(personCode).length > 0) {
      const url = this._urlService.API_ENDPOINT_ENQUIRY + "/CheckDuplicateEnquiryContactDetail" + `?EnquiryMaster_Code=${param.contactPersonsList[0].EnquiryMaster_Code}&MobileNO=${param.contactPersonsList[0].contactPersonMobile}&Email=${param.contactPersonsList[0].contactPersonEMail}&Code=${param.contactPersonsList[0].Code}`
      return this._http.post(url, { headers: this.headers() });
    }
    else {
      let url = this._urlService.API_ENDPOINT_ENQUIRY + "/SaveEnquiryMaster";
      return this._http.post(url, param);
    }
  }

  GetAccountDetails(companyName: string): Observable<any> {
    const url = this._urlService.API_ENDPOINT_ENQUIRY + '/GetAccountDetailsByAccountDesp' + `?AccountDesp=${companyName}`;
    return this._http.get(url);
  }

  GetEnquiryHistory(enquiryCode: string): Observable<any> {
    const url = this._urlService.API_ENDPOINT_ENQUIRY + '/GetEnquiryHistory' + `?EnquiryMaster_Code=${enquiryCode}`;
    return this._http.get(url);
  }

}
