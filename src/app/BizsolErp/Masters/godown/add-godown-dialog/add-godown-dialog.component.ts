// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-add-godown-dialog',
//   standalone: true,
//   imports: [],
//   templateUrl: './add-godown-dialog.component.html',
//   styleUrl: './add-godown-dialog.component.scss'
// })
// export class AddGodownDialogComponent {

// }


import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarAction, MatSnackBarActions, MatSnackBarLabel } from '@angular/material/snack-bar';





import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { MatIconModule } from '@angular/material/icon';

import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { GodownService } from '../../../../services/Master/godown.service';




@Component({
selector: 'app-add-godown-dialog',
  standalone: true,
   imports: [CommonModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatToolbarModule,
    MatCardModule, MatRadioModule, MatCheckboxModule, MatIconModule, ReactiveFormsModule, HttpClientModule,CommonModule],


  providers: [GodownService],
  templateUrl: './add-godown-dialog.component.html',
  styleUrl: './add-godown-dialog.component.scss'

})

export class AddGodownDialogComponent {
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
  private  godown : GodownService 
 ){}

  ngOnInit() {}
  addgodownForm = new FormGroup({
    ware_house_type: new FormControl('', Validators.required),
    sort_order: new FormControl('',Validators.required),
   ware_house_account_name: new FormControl('', Validators.required),
    ware_house_name: new FormControl('',Validators.required),
    short_description: new FormControl('',Validators.required),
    compony_alias_name:new FormControl('',Validators.required),
    address: new FormControl('',Validators.required),

    pin: new FormControl('',Validators.required),
    city: new FormControl('',Validators.required),

    gst_no: new FormControl('',Validators.required),
    tin_no: new FormControl('',Validators.required),
    cst_no: new FormControl('',Validators.required),
    cin_no: new FormControl(''),//optinal
    service_tax: new FormControl('',Validators.required),
    mobile_no: new FormControl('',Validators.required),
    email:new FormControl('',[Validators.required,Validators.email]),

    default: new FormControl(false),
    // cms_applicable: new FormControl(false),
    ware_house_group: new FormControl(''),
is_default_ware_house: new FormControl(false),
 
store_ware_house: new FormControl(false),

})


saveBankDetailsData(){

}
 checkEcms(value:any){

 }

 wareHouseList:any
 wareHouseType(){


 }

 getGodownData() {
  this.godown.getwarehouse('GetWarehouseMasterList').subscribe({
    next: (res: any) => {
  
    },
    error: (err: any) => {
      console.log(err.error.message);
    }
  });
}

  

 
 saveGodownDetails() {
  let  data = [
    
      {
        "code": 0,
        "godownName": "string",
        "isDefault": "string",
        "forStore": "string",
        "initialGoDownDesp": "string",
        "accountDesp": "string",
        "department": "string",
        "address1": "string",
        "city": "string",
        "pinCode": "string",
        "godownTINNo": "string",
        "godownCSTNo": "string",
        "godownCINNo": "string",
        "godownMobileNo": "string",
        "godownEmail": "string",
        "godownFor": "string",
        "godownGSTNo": "string",
        "godownSortOrder": 0,
        "gateEntryMandatory": "string",
        "showOnWeb": "string",
        "companyAliasName": "string",
        "forRejectedMaterial": "string",
        "warehouseGroup": "string",
        "inTransitWarehouse": "string",
        "applicableInDispatch": "string",
        "userName": "string",
        "userMaster_Code": 0
      }
    ]
  
  this.godown.savewareHouses(data).subscribe({
    next: (res: any) => {
  
    },
    error: (err: any) => {
      console.log(err.error.message);
    }
  });
}



  
  pinPoppulate() {
    const formValues = {
      country: this.getPincode?.CountryName ? this.getPincode?.CountryName :this.elementData.Nation ? this.elementData?.Nation :'',
      state: this.getPincode?.StateName,
      city: this.getPincode?.CityName,
    };
    // this.paymentTermsForm.patchValue(formValues);
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
    // this.dialogRef.close();
  }
  eCMSDebitData:any
 

  
  // checkEcms(event: any, controlName: string): void {
  //   this.controlValue = this.paymentTermsForm.get(controlName)?.value;
  //   console.log(this.controlValue);
   
  // }




 



 
  
 
  get f() {
    return this.addgodownForm.controls
  }


  transformToUpperCase(event: any, controlName: string) {
    const value: string = event.target.value;
    this.addgodownForm.controls[controlName].setValue(value.toUpperCase(), { emitEvent: false });
  }


   onKeyPress(event: KeyboardEvent) {
    const allowedChars = /^[a-zA-Z0-9@.]*$/;
    const inputChar = String.fromCharCode(event.charCode);

    if (!allowedChars.test(inputChar)) {
      event.preventDefault();
    }
  }




 
  
  
 
}
