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
    MatCardModule, MatRadioModule, MatCheckboxModule, MatIconModule, ReactiveFormsModule, HttpClientModule],

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

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _enquiryService: EnquiryService,
    private _state: StateService, private _city: CityService,
    private _http: HttpClient, private _urlService: UrlService,
    private bank: BankService,
    private snackBarService: SnackBarService,
    public dialogRef: MatDialogRef<AddBankDialogComponent>) {
    this.elementData = data.element
     console.log( this.elementData,"Hey  Ksishna ")
  }

  ngOnInit() {
    this.getCountryList()
   this.getDropList()
   this.patchBankData()

}
  paymentTermsForm = new FormGroup({
    bankName: new FormControl('', Validators.required),
    aliasName: new FormControl(),
    accountNo: new FormControl('', Validators.required),
    currency: new FormControl('',Validators.required),
    ifscCode: new FormControl('',Validators.required),
    swiftCode:new FormControl(''),
    pin: new FormControl(''),
    address: new FormControl(''),
    country: new FormControl(''),
    state: new FormControl(''),
    city: new FormControl(''),
    phone_no: new FormControl(''),
    fax_no: new FormControl(''),
    service_tax: new FormControl(''),
    Pan_No: new FormControl(''),
    email:new FormControl(''),
    default: new FormControl(false),
    cms_applicable: new FormControl(false),

})

patchBankData(){
  debugger
  console.log(this.elementData?.City,"hhh")
  // this.getCityList(this.elementData?.State)
  
  this.paymentTermsForm.patchValue({
    bankName: this.elementData?.BankName,
    aliasName: this.elementData.AliasName,
    accountNo: this.elementData.AccountNo,
    currency: this.elementData?.CurrencyName,
    ifscCode: this.elementData.IFSC_Code,
    swiftCode:this.elementData.SwiftCode,
    pin:this.elementData?.PinCode,
    address: this.elementData.Address,
    country: this.elementData.Nation,
    state: this.elementData.State,
    city: this.elementData?.City,
    phone_no: this.elementData.PhoneNo,
    fax_no: this.elementData.FaxNo,
    service_tax: this.elementData.ServiceTaxNo,
    Pan_No: this.elementData.PANNo,
    email:this.elementData.EMail,
    default:this.elementData.IsDefault,
    cms_applicable: this.elementData.VartualAccountAutoGenerate,
  
  })
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


 

  pinCode(val:any) {
    // const val = (event.target as HTMLSelectElement).value;
    this.paymentTermsForm.get('pin').setValue(val); // Set the value in the form control
    this._enquiryService.pincode(val).subscribe(res => {
      this.getPincode = res;
       console.log(this.getPincode,"ppppp")
      this.state(this.getPincode?.CountryName);
      this.city(this.getPincode?.StateName)
      // Call pinPoppulate() after getPincode data is available
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

  validateInput(event: any): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    // Handle case where multiple decimal points are entered
    const decimalParts = value.split('.');
    if (decimalParts.length > 2) {
      input.value = value.slice(0, -1);
      return;
    }

    // Handle value greater than 100
    if (parseFloat(value) > 100) {
      input.value = value.slice(0, -1);
    }
  }


  onNoClick(): void {
    this.dialogRef.close();
  }

 

  saveBankDetailsData() {
    debugger
    let data=[
      {
        
        code: this.elementData.Code ? this.elementData.Code:0,
        bankName: this.paymentTermsForm.value.bankName,
        accountNo:this.paymentTermsForm.value.accountNo,
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
        isDefault: this.paymentTermsForm.value.default == true ? "y" :'N',
        micrCode: "string",
        aliasName: this.paymentTermsForm.value.aliasName,
        swiftCode:this.paymentTermsForm.value.swiftCode,
        ecmsBank: "y",
        vartualAccountPrefix: "string",
        vartualAccountLength: 0,
        vartualAccountAutoGenerate: this.paymentTermsForm.value.cms_applicable == true ? 'y':'N',
        eCMSDebitAccountName: "hii ",
        userMaster_Code: 0
      }
    ]

    if (this.elementData.Code === undefined || 0) {
    this.bank.saveBank(data).subscribe({
      next: (res: any) => {
          this.paymentTermsForm.reset()
          this.dialogRef.close();
          this.snackBarService.showSuccessMessage(res.Msg);
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
         this.snackBarService.showSuccessMessage(res.Msg);
        },
      error: (err: any) => {  
        console.log(err.error.message);
        alert("Updated");

      }
    });

   }
  }

  getDropList(){
   let data ={
  "tableName": "CurrencyMaster",
  "fieldName": "Description",
  "fieldNameOrderBy": "",
  "distinct": "",
  "filterCondition": " And Description<>''"
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


  //====state=====
  getState(event:any) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.paymentTermsForm.get('country').setValue(selectedValue); // Set the value in the form control

    this._state.getStates(selectedValue).subscribe((res: any) => {
      this.stateList = res;
     console.log("check")
    })
  }
 
  getCityList(event:any) {
    const selectedValue = event.target.value ;
    // set state input value of form control named 'state' in form group
    this.paymentTermsForm.get('state').setValue(selectedValue); // Set the value in the form control

    this._city.getCity(selectedValue).subscribe((res: any) => {
      this.cityList = res;
      console.log(this.cityList,"llll")
    });
  }
  state(val:any) {
    this._state.getStates(val).subscribe(res => {
      this.stateList = res;
      console.log(this.stateList,"uuuuuuuuuuuuuuu")


    })
  }
  city(val:any) {
    this._city.getCity(val).subscribe(res => {
      this.cityList = res;
       console.log(this.cityList,"kkkkkkkkkk")
    });
  }
  //===================================end drop===========================
  get f() {
    return this.paymentTermsForm.controls
  }

}