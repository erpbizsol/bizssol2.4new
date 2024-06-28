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
import { ToasterService } from 'src/app/services/toaster-message/toaster.service';
import { DatasharingService } from 'src/app/services/subject/datasharing.service'




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
    MatCardModule, MatRadioModule, MatCheckboxModule, MatIconModule, ReactiveFormsModule, HttpClientModule, CommonModule],

  templateUrl: './add-bank-dialog.component.html',
  styleUrl: './add-bank-dialog.component.scss',
  providers: [BankService, StateService, EnquiryService, CityService]

})

export class AddBankDialogComponent {
  elementData: any
  currencies: any
  getPincode: any = [];
  cityList: any
  stateList: any
  eCMSDebitData: any
  countryList: any
  submitted: boolean = false
  dropListData: any
  bankNameList: any
  debitList: any
  controlValue: boolean = false
  readonly:boolean = false
  disabled:boolean = false
  view:boolean=false

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _enquiryService: EnquiryService,
    private _state: StateService, private _city: CityService,
    private _http: HttpClient, private _urlService: UrlService,
    private toaster: ToasterService,
    private bank: BankService,
    private datasharing: DatasharingService,
    private snackBarService: SnackBarService,
    public dialogRef: MatDialogRef<AddBankDialogComponent>) {
    this.elementData = data.element
     console.log(this.elementData,"hhh")
     this.view=data.view
     console.log(data.view,"kkkkpppp")
     this.readonly= this.elementData.Code !== undefined
     if(data.view!= undefined){
      this.disableFormControls(this.paymentTermsForm);


     }
     if (this.readonly) {
      debugger
      this.disableFormControls(this.ecmsForm);

      

    } else {
      this.enableFormControls(this.ecmsForm);
    }
  }
  formGroup(formGroup: any) {
    throw new Error('Method not implemented.');
  }

  ngOnInit() {
    this.getCountryList()
    this.getDropList()
    if (this.elementData.Code != undefined || 0) {
      this.patchBankData()

    }
    this.paymentTermsForm.controls['bankName'].valueChanges.subscribe(value => {
      this.paymentTermsForm.controls['aliasName'].setValue(value, { emitEvent: false });
      this.sendBankNameToService(value);
    });
  }
  disableFormControls(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.disable();
    });
  }

  enableFormControls(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.enable();
    });
  }
  paymentTermsForm = new FormGroup({
    bankName: new FormControl('', Validators.required),
    aliasName: new FormControl('', Validators.required),
    ifscCode: new FormControl('', Validators.required),
    swiftCode: new FormControl('', Validators.required),
    pin: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required),
    country: new FormControl('', Validators.required),
    state: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
    phone_no: new FormControl('', Validators.required),
    Pan_No: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    cms_applicable: new FormControl(false),

    // selectBank: new FormControl(''),
    // debitBankAccount: new FormControl(''),
    // prifix: new FormControl(''),
    gst: new FormControl('', Validators.required)

  })

  ecmsForm=new FormGroup({
    selectBank: new FormControl(''),
    debitBankAccount: new FormControl(''),
    prifix: new FormControl(''),
    gst: new FormControl('', Validators.required)

  })
  patchBankData() {
    this.paymentTermsForm.patchValue({
      bankName: this.elementData?.BankName,
      aliasName: this.elementData.AliasName,
      ifscCode: this.elementData.IFSC_Code,
      swiftCode: this.elementData?.SwiftCode,
      pin: this.elementData?.PinCode,
      address: this.elementData?.Address,
      country: this.elementData?.Nation,
      state: this.elementData?.State,
      city: this.elementData?.City,
      phone_no: this.elementData?.PhoneNo,
      Pan_No: this.elementData?.PANNo,
      email: this.elementData?.EMail,
      gst:this.elementData?.GSTNo,
      cms_applicable: this.elementData.eCMSBank != "" ? true : false,
    })
    if (this.elementData.eCMSBank != "") {
      this.controlValue = true
      this.getDebit()
      this.getBankDropDown()
      this.ecmsForm.patchValue({
        selectBank: this.elementData?.eCMSBank,
        debitBankAccount: this.elementData?.eCMSDebitAccount,
        prifix: this.elementData?.VartualAccountPrefix
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


  pinCode(val: any) {
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
      country: this.getPincode?.CountryName ? this.getPincode?.CountryName : this.elementData.Nation ? this.elementData?.Nation : '',
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
  allowAlphabetsOnlyDot(event: KeyboardEvent): void {
    const charCode = event.which ? event.which : event.keyCode;
    const charStr = String.fromCharCode(charCode);

    // Allow alphabets, dot, and white space
    if (!/^[a-zA-Z.\s]*$/.test(charStr)) {
      event.preventDefault();
    }
  }

  allowAlphabetsOnlyAddress(event: KeyboardEvent): void {
    const charCode = event.which ? event.which : event.keyCode;
    const charStr = String.fromCharCode(charCode);

    // Allow alphabets, dot, and white space
    if (!/^[a-zA-Z.,-\s]*$/.test(charStr)) {
      event.preventDefault();
    }
  }
  onEmailInputEmail(event: any): void {
    const inputValue = event.target.value;
    const lowerCaseValue = inputValue.toLowerCase();
    this.paymentTermsForm.value.email = lowerCaseValue;
    event.target.value = lowerCaseValue;
  }



  capitalizeWords(inputValue: string) {
    throw new Error('Method not implemented.');
  }
  onInputChange2(event: any) {
    const inputValue: string = event.target.value;
    const formattedValue = this.capitalizeWordss(inputValue);
    this.paymentTermsForm.get('bankName').setValue(formattedValue);
    
  }

  capitalizeWordss(str: string): string {
    return str.replace(/(?:^|\s|\.)\S/g, (char) => char.toUpperCase());
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

  validatePAN(event: any) {
    const panInput = event.target;
    const panValue = panInput.value.toUpperCase();
    const key = String.fromCharCode(event.which);

    // Allow only letters and numbers
    if (!/^[A-Z0-9]$/.test(key)) {
      event.preventDefault();
      return;
    }

    // Validate each character position
    const length = panValue.length;

    if (length < 5) {
      // First 5 characters must be letters
      if (!/[A-Z]/.test(key)) {
        event.preventDefault();
      }
    } else if (length < 9) {
      // Next 4 characters must be numbers
      if (!/[0-9]/.test(key)) {
        event.preventDefault();
      }
    } else if (length === 9) {
      // Last character must be a letter
      if (!/[A-Z]/.test(key)) {
        event.preventDefault();
      }
    }
  }
  saveBankDetailsData() {
    // debugger
    this.submitted = true
    if (this.paymentTermsForm.invalid) {
      return
    }
    let data = [
      {
        code: this.elementData.Code ? this.elementData.Code : 0,
        bankName: this.paymentTermsForm.value.bankName,
        currencyName: '',
        address: this.paymentTermsForm.value.address,
        Nation: this.paymentTermsForm.value.country,
        pinCode: this.paymentTermsForm.value.pin,
        city: this.paymentTermsForm.value.city,
        state: this.paymentTermsForm.value.state,
        eMail: this.paymentTermsForm.value.email,
        phoneNo: this.paymentTermsForm.value.phone_no,
        faxNo: "",
        serviceTaxNo: "",
        panNo: this.paymentTermsForm.value.phone_no,
        databaseLocation_Code: 0,
        ifsC_Code: this.paymentTermsForm.value.ifscCode,
        // isDefault: this.paymentTermsForm.value.default == true ? "Y" :'N',
        isDefault: 'N',
        micrCode: "string",
        aliasName: this.paymentTermsForm.value.aliasName,
        swiftCode: this.paymentTermsForm.value.swiftCode,
        ecmsBank: this.paymentTermsForm.value.cms_applicable == true ? this.ecmsForm.value.selectBank : "",
        vartualAccountPrefix: this.paymentTermsForm.value.cms_applicable == true ? this.ecmsForm.value.prifix : "",
        vartualAccountLength: 0,
        vartualAccountAutoGenerate: 'Y',
        eCMSDebitAccountName: this.ecmsForm.value.debitBankAccount,
        userMaster_Code: 0,
        GSTNO: this.paymentTermsForm.value.gst,


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

    } else {
      this.bank.saveBank(data).subscribe({
        next: (res: any) => {
          this.paymentTermsForm.reset()
          this.dialogRef.close();
          //  this.toaster.showSuccess(res.Msg)

          this.snackBarService.showSuccessMessage(res.Msg);
        },
        error: (err: any) => {
          console.log(err.error.message)
        }
      });
    }
  }


  checkEcms(event: any, controlName: string): void {
    this.controlValue = this.paymentTermsForm.get(controlName)?.value;
     console.log(this.controlValue,"valu")
    if( this.controlValue ){
      this.getDebit()
      this.getBankDropDown()

    }else{
      this.controlValue =false
    }

  }


  getDropList() {
    let data = {
      tableName: "CurrencyMaster",
      fieldName: "Description",
      fieldNameOrderBy: "",
      distinct: "",
      filterCondition: " And Description<>''"
    }
    this._http.post(this._urlService.API_ENDPOINT_DROPDOWN + '/GetDropDownList', data).subscribe((res: any) => {
      this.dropListData = res;
    })
  }

  getCountryList() {
    this._http.get(this._urlService.API_ENDPOINT_COUNTRY + '/GetCountryMasterList').subscribe((res: any) => {
      this.countryList = res;
      this.state('India');
    })
  }


  getState(event: any) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.paymentTermsForm.get('country').setValue(selectedValue); // Set the value in the form control

    this._state.getStates(selectedValue).subscribe((res: any) => {
      this.stateList = res;
    })
  }

  getCityList(event: any) {
    const selectedValue = event.target.value;

    this.paymentTermsForm.get('state').setValue(selectedValue); // Set the value in the form control

    this._city.getCity(selectedValue).subscribe((res: any) => {
      this.cityList = res;
    });
  }
  state(val: any) {
    this._state.getStates(val).subscribe(res => {
      this.stateList = res;


    })
  }
  city(val: any) {
    this._city.getCity(val).subscribe(res => {
      this.cityList = res;
    });
  }
  get f() {
    return this.paymentTermsForm.controls
  }
  
  get g() {
    return this.ecmsForm.controls
  }

  transformToUpperCase(event: any, controlName: string) {
    const value: string = event.target.value;
    this.paymentTermsForm.controls[controlName].setValue(value.toUpperCase(), { emitEvent: false });
  }
  onInputChange(event: any) {
    const inputValue: string = event.target.value;
    let newValue = inputValue.replace(/[^0-9]/g, ''); // Remove non-numeric characters
    if (newValue.startsWith('0')) {
      newValue = inputValue.slice(1);
    }
    this.paymentTermsForm.get('phone_no').setValue(newValue.slice(0, 10)); // Limit input to 10 characters
  }




  onKeyPress(event: KeyboardEvent) {
    const allowedChars = /^[a-zA-Z0-9@.]*$/;
    const inputChar = String.fromCharCode(event.charCode);

    if (!allowedChars.test(inputChar)) {
      event.preventDefault();
    }
  }



  allowAlphabetsAndNumbersOnly(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.toUpperCase();

    // Remove any characters that are not alphabets or numbers
    value = value.replace(/[^A-Z0-9]/g, '');

    input.value = value;
  }


  getBankDropDown() {
    this.bank.getecmsDropDown('GetF_eCMSMasterList').subscribe({
      next: (res: any) => {
        this.bankNameList = res
        console.log(this.bankNameList)

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

      },
      error: (err: any) => {
        console.log(err.error.message);
      }
    });
  }
}
