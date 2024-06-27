import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UrlService } from '../URL/url.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../Auth-Service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class HSNCodeMasterService {
  constructor(private _http: HttpClient, private _urlService: UrlService, private authService: AuthService) { }

  private headers(): HttpHeaders {
    // const authKey = this.authService.getAuthKey();
    return new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      // 'Auth-Key': ` ${authKey}`
    });
  }

  getHSNCodeMaterList(): Observable<any> {
    let url = this._urlService.API_ENDPOINT_HSNCodeMaster + "/GetHSNCodeMaterList";
    return this._http.get(url);
  }
  editHSNCodeMasters(Code: number): Observable<any> {
    let url = this._urlService.API_ENDPOINT_HSNCodeMaster + "/" + `${Code}`;
    return this._http.get(url, { headers: this.headers() });
  }

  deleteHSNCode(code: number, reason: any): Observable<any> {
    let url = this._urlService.API_ENDPOINT_HSNCodeMaster + "/DeleteHSNCodeMaster" + `?code=${code}&UserMaster_Code=13&ReasonForDelete=${reason}`;
    return this._http.post(url, '', { headers: this.headers() });
  }
  saveHSNCode(hsnCodeData: any): Observable<any> {
    const data = JSON.stringify(hsnCodeData)
    // const headers = new HttpHeaders().set('Content-Type', 'application/json');
    let url = this._urlService.API_ENDPOINT_HSNCodeMaster + "/SaveHSNCodeMaster";
    // return this._http.post(url, data, { headers: this.headers() });
    return this._http.post(url, hsnCodeData, { headers: this.headers() });
  }
}
