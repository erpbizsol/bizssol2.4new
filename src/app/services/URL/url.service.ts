import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class UrlService {

BASE_URL: string = environment.BASE_URL;
ERP_SIDE_MENU: string = `${this.BASE_URL}/UserModule`
API_ENDPOINT_ENQUIRY: string = `${this.BASE_URL}/Enquiry`;
API_ENDPOINT_COUNTRY: string = `${this.BASE_URL}/Country`;//priyabrath
API_ENDPOINT_STATE: string = `${this.BASE_URL}/State`;//priyabrath
API_ENDPOINT_CITY: string = `${this.BASE_URL}/City`;//priyabrath
API_ENDPOINT_CHEMICAL: string = `${this.BASE_URL}/Chemical`; //priyabrath
API_ENDPOINT_LEADSOURCE: string = `${this.BASE_URL}/LeadSource`;
API_ENDPOINT_INDUSTRYTYPE: string = `${this.BASE_URL}/IndustryType`;
API_ENDPOINT_DEPARTMENT: string = `${this.BASE_URL}/Department`;
API_ENDPOINT_DESIGNATION: string = `${this.BASE_URL}/Designation`;
API_ENDPOINT_SALESPERSON: string = `${this.BASE_URL}/MarketingMan`;
API_ENDPOINT_ENQUIRYFOLLOWUP: string = `${this.BASE_URL}/EnquiryFollowUp`;
API_ENDPOINT_UOM: string = `${this.BASE_URL}/UOM`;
API_ENDPOINT_PRODUCT: string = `${this.BASE_URL}/Item`;
API_ENDPOINT_SPECIFICATION: string = `${this.BASE_URL}/ItemSize`;
API_ENDPOINT_PAYMENT_TERMS_MASTER: string = `${this.BASE_URL}/PaymentTerms`; // shobha 
API_ENDPOINT_BANK_MASTER: string = `${this.BASE_URL}/Bank`; // shobha 
API_ENDPOINT_DROPDOWN: string = `${this.BASE_URL}/Dropdown`; // shobha 

 
  API_ENDPOINT_DROPDOWND = `${this.BASE_URL}/Dropdown/GetDropdownList`;
  
  API_ENDPOINT_HEATTREATMENT: string;
  API_ENDPOINT_Dropdown:String= `${this.BASE_URL}/Dropdown`;
  API_ENDPOINT_TankConfiguration:String= `${this.BASE_URL}/TankConfiguration`;
  API_ENDPOINT_HSNCodeMaster:String= `${this.BASE_URL}/HSNCodeMaster`;

  API_ENDPOINT_TankDailyStock:String= `${this.BASE_URL}/DailyTankStock`;

  API_ENDPOINT_ROUTE_PLAN: string = `${this.BASE_URL}/RoutePlan`;

  API_ENDPOINT_ACCOUNT_MASTER: string = `${this.BASE_URL}/AccountMaster`;
  


  constructor() { }
  // BASE_URL: string = environment.BASE_URL;

  // constructor(private authService: AuthService) { }

  // private withAuthKey(endpoint: string): string {
  //   const authKey = this.authService.getAuthKey();
  //   return authKey ? `${endpoint}?Auth-Key=${authKey}` : endpoint;
  // }

  // get API_ENDPOINT_ENQUIRY(): string {
  //   return this.withAuthKey(`${this.BASE_URL}/Enquiry`);
  // }

  // get API_ENDPOINT_COUNTRY(): string {
  //   return this.withAuthKey(`${this.BASE_URL}/Country`);
  // }

  // get API_ENDPOINT_STATE(): string {
  //   return this.withAuthKey(`${this.BASE_URL}/State`);
  // }

  // get API_ENDPOINT_CITY(): string {
  //   return this.withAuthKey(`${this.BASE_URL}/City`);
  // }

  // get API_ENDPOINT_LEADSOURCE(): string {
  //   return this.withAuthKey(`${this.BASE_URL}/LeadSource`);
  // }

  // get API_ENDPOINT_INDUSTRYTYPE(): string {
  //   return this.withAuthKey(`${this.BASE_URL}/IndustryType`);
  // }

  // get API_ENDPOINT_DEPARTMENT(): string {
  //   return this.withAuthKey(`${this.BASE_URL}/Department`);
  // }

  // get API_ENDPOINT_DESIGNATION(): string {
  //   return this.withAuthKey(`${this.BASE_URL}/Designation`);
  // }

  // get API_ENDPOINT_SALESPERSON(): string {
  //   return this.withAuthKey(`${this.BASE_URL}/MarketingMan`);
  // }

  // get API_ENDPOINT_ENQUIRYFOLLOWUP(): string {
  //   return this.withAuthKey(`${this.BASE_URL}/EnquiryFollowUp`);
  // }

  // get API_ENDPOINT_UOM(): string {
  //   return this.withAuthKey(`${this.BASE_URL}/UOM`);
  // }

  // get API_ENDPOINT_PRODUCT(): string {
  //   return this.withAuthKey(`${this.BASE_URL}/Item`);
  // }

  // get API_ENDPOINT_SPECIFICATION(): string {
  //   return this.withAuthKey(`${this.BASE_URL}/ItemSize`);
  // }
}

