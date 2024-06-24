import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, switchMap } from 'rxjs';
import { UrlService } from '../URL/url.service';
import { AuthService } from '../Auth-Service/auth.service';
import { UserService } from '../Shared/user.service';
import { UserDetailsService } from '../user-details/user-details.service';
@Injectable({
  providedIn: 'root'
})
export class VisitMasterService {
  constructor(private _http: HttpClient, private _urlService: UrlService, private authService: AuthService, private userDetailsService: UserDetailsService, private userService: UserService) { }

  private headers(): HttpHeaders {
    const authKey = this.authService.getAuthKey();
    const userMasterCode = this.authService.getUserMasterCode();
    const headersConfig: { [key: string]: string } = {
      'Content-Type': 'application/json; charset=utf-8',
      'Auth-Key': '{"ERPDBConStr": "Data Source=220.158.165.98,65446;Connection Timeout=0;Persist Security Info=true;Initial Catalog=BizSolERPDBBizTest;User ID=sa;pwd=biz1981;Packet Size=32000","ERPMainDBConStr": "Data Source=192.168.1.10;Connection Timeout=0;Persist Security Info=true;Initial Catalog=BizSolERPMainDB_GLENG;User ID=sa;pwd=biz1981;Packet Size=32000","ERPDMSDBConStr": "Data Source=192.168.1.10;Connection Timeout=0;Persist Security Info=true;Initial Catalog=BizSolERPDMSDB_GLENG;User ID=sa;pwd=biz1981;Packet Size=32000","ERPDB_Name":"BizSolERPDBGLENG_Temp","ERPMainDB_Name":"BizSolERPMainDB_GLENG","ERPDMSDB_Name":"BizSolERPDMSDB_GLENG","AuthToken": "xyz"}' || ''
    };
    if (userMasterCode) {
      headersConfig['UserMaster-Code'] = userMasterCode;
    }
    return new HttpHeaders(headersConfig);
  }

  getVisitMasterList(fromDate: any, toDate: any): Observable<any> {
    debugger
    const userDetails = this.userService.getUserDetails();
    console.log("dffdgfdgfffs",this.userService.getUserDetails())

    if (!userDetails || !userDetails.usrID) {
      throw new Error('User details or usrID is missing');
    }
    const userId = userDetails[0].usrID;

    const url = `${this._urlService.API_ENDPOINT_VISIT_MASTER}/GetVerifiedRoutePlanUserAndDateWise?User_ID=${userId}&MarketingMan_Name=ALL&FromDate=${fromDate}&ToDate=${toDate}`;
    return this._http.get(url, { headers: this.headers() });
  }



  checkIn(routePlanMasterCode: any, checkIn: any, location: any, checkedLocation: any){
    const userMasterCode = this.authService.getUserMasterCode();    
    let url = this._urlService.API_ENDPOINT_VISIT_MASTER + `/CheckInVisit?RoutePlanMaster_Code=${routePlanMasterCode}&CheckIn=${checkIn}&Location=${location}&ChekedInLocation=${checkedLocation}&UserMaster_Code=${userMasterCode}`;
    return this._http.post(url, {}, { headers: this.headers() });  }

}
