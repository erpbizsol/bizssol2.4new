import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UrlService } from '../URL/url.service';
import { Observable } from 'rxjs';
import { AuthService } from '../Auth-Service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ContactPersonService {

  constructor(private _http: HttpClient, private _urlService: UrlService, private authService: AuthService) { }

  private headers(): HttpHeaders {
    const authKey = this.authService.getAuthKey(); 
    return new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      'Auth-Key': ` ${authKey}`     });
  }

  getPersonList(): Observable<any> {
    let url = this._urlService.API_ENDPOINT_ENQUIRY + "/GetEnquiryMasterList";
    return this._http.get(url, { headers: this.headers() });
  }

  postPersonDetails(Obj: Object): Observable<any> {
    const data = JSON.stringify(Obj)
    let url = this._urlService.API_ENDPOINT_ENQUIRY + "/SaveEnquiryMaster";
    return this._http.post(url, Obj, { headers: this.headers() });
  }

  personDesignation(): Observable<any> {
    let url = this._urlService.API_ENDPOINT_DESIGNATION + "/GetDesignationMasterlist";
    return this._http.get(url, { headers: this.headers() });
  }
}
