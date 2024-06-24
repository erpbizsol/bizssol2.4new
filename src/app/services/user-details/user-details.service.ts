import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../Auth-Service/auth.service';
import { UrlService } from '../URL/url.service';

@Injectable({
  providedIn: 'root'
})
export class UserDetailsService {
  constructor(private _http: HttpClient, private _urlService: UrlService, private authService: AuthService) { }

  private headers(): HttpHeaders {
    const authKey = this.authService.getAuthKey();
    return new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      'Auth-Key': '{"ERPDBConStr": "Data Source=220.158.165.98,65446;Connection Timeout=0;Persist Security Info=true;Initial Catalog=BizSolERPDBBizTest;User ID=sa;pwd=biz1981;Packet Size=32000","ERPMainDBConStr": "Data Source=220.158.165.98,65446;Connection Timeout=0;Persist Security Info=true;Initial Catalog=BizSolERPMainDB_BizTest;User ID=sa;pwd=biz1981;Packet Size=32000","ERPDMSDBConStr": "Data Source=192.168.1.10;Connection Timeout=0;Persist Security Info=true;Initial Catalog=BizSolERPDMSDB_GLENG;User ID=sa;pwd=biz1981;Packet Size=32000","ERPDB_Name":"BizSolERPDBGLENG_Temp","ERPMainDB_Name":"BizSolERPMainDB_BizTest","ERPDMSDB_Name":"BizSolERPDMSDB_GLENG","AuthToken": "xyz","UserMaster_Code":"13"}'
    });
  }

  getUserDetails(): Observable<any> {
    const userMasterCode = '13';    
    let url = this._urlService.ERP_SIDE_MENU + "/GetUserDetails" + `?UserMaster_Code=${userMasterCode}`
        return this._http.get(url, { headers: this.headers() });
  }
}
