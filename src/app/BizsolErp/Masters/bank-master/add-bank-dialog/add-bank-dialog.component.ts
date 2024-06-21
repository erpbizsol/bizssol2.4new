import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarAction, MatSnackBarActions, MatSnackBarLabel } from '@angular/material/snack-bar';



import { BankService } from 'src/app/services/Master/bank.service';


import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SnackBarService } from 'src/app/services/SnakBar-Service/snack-bar.service';

import { MatIconModule } from '@angular/material/icon';

import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { EnquiryService } from 'src/app/services/Transaction/enquiry.service';
import { CityService } from 'src/app/services/Master/city.service';
import { StateService } from 'src/app/services/Master/state.service';
import { UrlService } from 'src/app/services/URL/url.service';
import { tail } from 'lodash-es';
import { ToasterService } from 'src/app/services/toaster-message/toaster.service';
import{ DatasharingService} from 'src/app/services/subject/datasharing.service'




@Component({
  selector: 'app-add-bank-dialog',
  standalone: true,
   imports: [CommonModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatToolbarModule,
    MatCardModule, MatRadioModule, MatCheckboxModule, MatIconModule, ReactiveFormsModule, HttpClientModule,CommonModule],

  templateUrl: './add-bank-dialog.component.html',
  styleUrl: './add-bank-dialog.component.scss',
  providers: [BankService,StateService,EnquiryService,CityService]

})

export class AddBankDialogComponent {
  elementData: any
  currencies:any
  getPincode: any = [];
  cityList:any
  stateList:any
  countryList:any
  submitted: boolean = false
  dropListData:any
  bankNameList:any
  debitList:any
  controlValue:boolean = false


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _enquiryService: EnquiryService,
    private _state: StateService, private _city: CityService,
    private _http: HttpClient, private _urlService: UrlService,
    private toaster:ToasterService,
    private bank: BankService,
    private datasharing: DatasharingService,
    private snackBarService: SnackBarService,
    public dialogRef: MatDialogRef<AddBankDialogComponent>) {
    this.elementData = data.element
  }

  ngOnInit() {
   this.getCountryList()
   this.getDropList()
   if(this.elementData.Code != undefined || 0){
    this.patchBankData()

   }
   this.paymentTermsForm.controls['bankName'].valueChanges.subscribe(value => {
   this.paymentTermsForm.controls['aliasName'].setValue(value, { emitEvent: false });
   this.sendBankNameToService(value);
  });
}
  paymentTermsForm = new FormGroup({
    bankName: new FormControl('', Validators.required),
    aliasName: new FormControl('',Validators.required),
    account_No: new FormControl('', Validators.required),
    currency: new FormControl('',Validators.required),
    ifscCode: new FormControl('',Validators.required),
    swiftCode:new FormControl('',Validators.required),
    pin: new FormControl('',Validators.required),
    address: new FormControl('',Validators.required),
    country: new FormControl('',Validators.required),
    state: new FormControl('',Validators.required),
    city: new FormControl('',Validators.required),
    phone_no: new FormControl('',Validators.required),
    fax_no: new FormControl(''),//optinal
    service_tax: new FormControl('',Validators.required),
    Pan_No: new FormControl('',Validators.required),
    email:new FormControl('',[Validators.required,Validators.email]),
    default: new FormControl(false),
    cms_applicable: new FormControl(false),
    selectBank: new FormControl(''),
    debitBankAccount: new FormControl (''),
    prifix: new FormControl('')

})

patchBankData(){
    this.paymentTermsForm.patchValue({
    bankName: this.elementData?.BankName,
    aliasName: this.elementData.AliasName,
    account_No: this.elementData.AccountNo,
    currency: this.elementData?.CurrencyName,
    ifscCode: this.elementData.IFSC_Code,
    swiftCode:this.elementData?.SwiftCode,
    pin:this.elementData?.PinCode,
    address: this.elementData?.Address,
    country: this.elementData?.Nation,
    state: this.elementData?.State,
    city: this.elementData?.City,
    phone_no: this.elementData?.PhoneNo,
    fax_no: this.elementData.FaxNo,
    service_tax: this.elementData?.ServiceTaxNo,
    Pan_No: this.elementData?.PANNo,
    email:this.elementData?.EMail,
    default:this.elementData?.IsDefault,
    cms_applicable: this.elementData.eCMSBank != ""? true: false ,
  })
if(this.elementData.eCMSBank!=""){
  this.controlValue = true
  this.getDebit()
  this.getBankDropDown()
  this.paymentTermsForm.patchValue({
    selectBank:this.elementData?.eCMSBank,
    debitBankAccount:this.elementData?.eCMSDebitAccount,
    prifix:this.elementData?.VartualAccountPrefix
  })
}
  this._http.get(this._urlService.API_ENDPOINT_CITY + `/GetCityList?StateName=${this.elementData?.State}`).subscribe((res: any) => {
    this.cityList = res;
  })
}

 pinAcceptOnlyNumber(event: any) {
    const inputValue: string = event.target.value;
    const newValue = inputValue.replace(/[^0-9]/g, ''); // Remove non-numeric characters
    this.paymentTermsForm.get('pin').setValue(newValue.slice(0, 10)); // Limit input to 10 characters
    this.pinCode(newValue)
  }

  sendBankNameToService(bankName: string) {
    this.datasharing.sendData({ bankName });
  }
 

  pinCode(val:any) {
    // const val = (event.target as HTMLSelectElement).value;
    this.paymentTermsForm.get('pin').setValue(val); // Set the value in the form control
    this._enquiryService.pincode(val).subscribe(res => {
      this.getPincode = res;
      this.state(this.getPincode?.CountryName);
      this.city(this.getPincode?.StateName)
      this.pinPoppulate();
    })
  }
  pinPoppulate() {
    const formValues = {
      country: this.getPincode?.CountryName ? this.getPincode?.CountryName :this.elementData.Nation ? this.elementData?.Nation :'',
      state: this.getPincode?.StateName,
      city: this.getPincode?.CityName,
    };
    this.paymentTermsForm.patchValue(formValues);
  }

allowAlphabetsOnly(event: KeyboardEvent): void {
    const charCode = event.which ? event.which : event.keyCode;
    const charStr = String.fromCharCode(charCode);

    if (!/^[a-zA-Z\s]*$/.test(charStr)) {
      event.preventDefault();
    }
  }


  allowNumberOnly(event: KeyboardEvent): void {
    const charCode = event.which ? event.which : event.keyCode;
    const charStr = String.fromCharCode(charCode);

    // Allow numbers and decimal point
    if (!/^[0-9.]*$/.test(charStr)) {
      event.preventDefault();
    }
  }

  
 onNoClick(): void {
    this.dialogRef.close();
  }
  eCMSDebitData:any
  saveBankDetailsData() {
    debugger
   this.submitted=true
    if(this.paymentTermsForm.invalid){
      return
    }
    console.log(this.paymentTermsForm.value,"jjjj")
    let data=[
      {
        code: this.elementData.Code ? this.elementData.Code:0,
        bankName: this.paymentTermsForm.value.bankName,
        accountNo:this.paymentTermsForm.value.account_No,
        currencyName:this.paymentTermsForm.value.currency,
        address: this.paymentTermsForm.value.address,
        Nation: this.paymentTermsForm.value.country,
        pinCode:this.paymentTermsForm.value.pin,
        city:this.paymentTermsForm.value.city,
        state:this.paymentTermsForm.value.state,
        eMail: this.paymentTermsForm.value.email,
        phoneNo:this.paymentTermsForm.value.phone_no,
        faxNo: this.paymentTermsForm.value.fax_no,
        serviceTaxNo: this.paymentTermsForm.value.service_tax,
        panNo:this.paymentTermsForm.value.phone_no,
        databaseLocation_Code: 0,
        ifsC_Code: this.paymentTermsForm.value.ifscCode,
        isDefault: this.paymentTermsForm.value.default == true ? "Y" :'N',
        micrCode: "string",
        aliasName: this.paymentTermsForm.value.aliasName,
        swiftCode:this.paymentTermsForm.value.swiftCode,
        ecmsBank:this.paymentTermsForm.value.cms_applicable == true ? this.paymentTermsForm.value.selectBank :"",
        vartualAccountPrefix: this.paymentTermsForm.value.cms_applicable == true ? this.paymentTermsForm.value.prifix :"",
        vartualAccountLength: 0,
        vartualAccountAutoGenerate:'Y',
        eCMSDebitAccountName: this.paymentTermsForm.value.cms_applicable == true ? this.paymentTermsForm.value.debitBankAccount :"",
        userMaster_Code: 0,

      }
    ]
delete this.paymentTermsForm.value.cms_applicable
    if (this.elementData.Code === undefined || 0) {
    this.bank.saveBank(data).subscribe({
      next: (res: any) => {
          this.paymentTermsForm.reset()
          this.dialogRef.close();
         this.snackBarService.showSuccessMessage(res.Msg);
        //  this.toaster.showSuccess(res.Msg)
        },
      error: (err: any) => {  
        console.log(err.error.message);
      }
    });

   }else{
    this.bank.saveBank(data).subscribe({
      next: (res: any) => {
         this.paymentTermsForm.reset()
         this.dialogRef.close();
        //  this.toaster.showSuccess(res.Msg)

         this.snackBarService.showSuccessMessage(res.Msg);
        },
      error: (err: any) => {  
        console.log(err.error.message);
        alert("Updated");

      }
    });}
  }

  
  checkEcms(event: any, controlName: string): void {
    this.controlValue = this.paymentTermsForm.get(controlName)?.value;
    console.log(this.controlValue);
    // this.getBankDropDown()
    this.getDebit()
    this.getBankDropDown()
  }


  getDropList(){
   let data ={
  tableName: "CurrencyMaster",
  fieldName: "Description",
  fieldNameOrderBy: "",
  distinct: "",
  filterCondition: " And Description<>''"
   }
  this._http.post(this._urlService.API_ENDPOINT_DROPDOWN + '/GetDropDownList',data).subscribe((res: any) => {
    this.dropListData = res;
  })
}

  getCountryList(){
    this._http.get(this._urlService.API_ENDPOINT_COUNTRY + '/GetCountryMasterList').subscribe((res: any) => {
      this.countryList = res;
      this.state('India');
    })
  }


  getState(event:any) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.paymentTermsForm.get('country').setValue(selectedValue); // Set the value in the form control

    this._state.getStates(selectedValue).subscribe((res: any) => {
      this.stateList = res;
    })
  }
 
  getCityList(event:any) {
    const selectedValue = event.target.value ;
    
    this.paymentTermsForm.get('state').setValue(selectedValue); // Set the value in the form control

    this._city.getCity(selectedValue).subscribe((res: any) => {
      this.cityList = res;
    });
  }
  state(val:any) {
    this._state.getStates(val).subscribe(res => {
      this.stateList = res;


    })
  }
  city(val:any) {
    this._city.getCity(val).subscribe(res => {
      this.cityList = res;
    });
  }
  get f() {
    return this.paymentTermsForm.controls
  }


  transformToUpperCase(event: any, controlName: string) {
    const value: string = event.target.value;
    this.paymentTermsForm.controls[controlName].setValue(value.toUpperCase(), { emitEvent: false });
  }


   onKeyPress(event: KeyboardEvent) {
    const allowedChars = /^[a-zA-Z0-9@.]*$/;
    const inputChar = String.fromCharCode(event.charCode);

    if (!allowedChars.test(inputChar)) {
      event.preventDefault();
    }
  }




  getBankDropDown() {
    this.bank.getecmsDropDown('GetF_eCMSMasterList').subscribe({
      next: (res: any) => {
        this.bankNameList = res
         console.log(this.bankNameList )
        //  this.getDebit()
      },
      error: (err: any) => {
        console.log(err.error.message);
      }
    });
  }
  
  
  getDebit() {
   this.bank.GetDebitAccountData('GetDebitAccountDetails').subscribe({
     next: (res: any) => {
       this.debitList = res
        // console.log(this.debitList ,"kkkkkkkkkk")
     },
     error: (err: any) => {
       console.log(err.error.message);
     }
   });
 }
}
