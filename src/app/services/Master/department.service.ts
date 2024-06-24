import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UrlService } from '../URL/url.service';
import { AuthService } from '../Auth-Service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  userCode: any;

  constructor(private _http: HttpClient, private _urlService: UrlService, private authService: AuthService) { }

  private headers(): HttpHeaders {
    const authKey = this.authService.getAuthKey();

   

    return new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      'Auth-Key': ` ${authKey}`    });
  }
  getDepartment(): Observable<any> {
    let url = this._urlService.API_ENDPOINT_DEPARTMENT + "/GetDepartmentMasterList";
    return this._http.get(url, { headers: this.headers() });
  }
  editDepartment(Code: number): Observable<any> {
    console.log("Department",);
    let url = this._urlService.API_ENDPOINT_DEPARTMENT + "/" + Code;
    return this._http.get(url, { headers: this.headers() });
  }
  deleteDepartment(code: number, reason: any): Observable<any> {
    const userMasterCode = this.authService.getUserMasterCode();
    let url = this._urlService.API_ENDPOINT_DEPARTMENT + "/DeleteDepartmentMaster" + `?code=${code}&UserMaster_Code=${userMasterCode}&ReasonForDelete=${reason}`;
    return this._http.post(url, '', { headers: this.headers() });
  }
  postDepartment(Obj: any): Observable<any> {
    const data = JSON.stringify(Obj)
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    console.log("Department", data);
    let url = this._urlService.API_ENDPOINT_DEPARTMENT + "/SaveDepartmentMaster";
    return this._http.post(url, data, { headers: this.headers() });
  }
  getDepartmentType(obj: any): Observable<any> {
    let url = this._urlService.API_ENDPOINT_Dropdown + "/GetDropdownList";
    return this._http.post<any>(url, obj);
  }

}
