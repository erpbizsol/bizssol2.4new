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
import {MatTabsModule} from '@angular/material/tabs';





import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { MatIconModule } from '@angular/material/icon';

import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { GodownService } from '../../../../services/Master/godown.service';
import { ToasterService } from 'src/app/services/toaster-message/toaster.service';




@Component({
selector: 'app-add-godown-dialog',
  standalone: true,
   imports: [CommonModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTabsModule,
    MatIconModule,
    MatToolbarModule,
    MatCardModule, MatRadioModule, MatCheckboxModule, MatIconModule, ReactiveFormsModule, HttpClientModule,CommonModule],


  providers: [GodownService],
  templateUrl: './add-godown-dialog.component.html',
  styleUrl: './add-godown-dialog.component.scss'

})


export class AddGodownDialogComponent {
  GetWarehouseAccountNameList:any
  elementData: any
  currencies:any
  getPincode: any = [];
  cityList:any
  stateList:any
  submitted:any
  countryList:any
  dropListData:any
  bankNameList:any
  debitList:any
  controlValue:boolean = false
  editData:any


 constructor(
  private  godown : GodownService ,
  private toaser:ToasterService,
  @Inject(MAT_DIALOG_DATA) public data: any,
 ){
  console.log(this.editData)
 }

 patchWareHouseData(){
  this.addgodownForm.patchValue({
    ware_house_type:this.editData.war,
    sort_order: this.editData.GodownSortOrder,
   ware_house_account_no:this.editData.c,
    ware_house_name: this.editData?.GodownName,
    short_description:this.editData?.short_description,
    compony_alias_name:this.editData.CompanyAliasName,
    pin:this.editData.PINCode,
    address: this.editData.Address1,
    city: this.editData.City,
    gst_no: this.editData?.GodownGSTNo,
    tin_no: this.editData.GodownTINNo,
    cst_no: this.editData.GodownCSTNo,
    cin_no:this.editData?.GodownCINNo,//optinal
    mobile_no: this.editData.GodownMobileNo,
    email:this.editData.GodownEmail,

    // cms_applicable: new FormControl(false),
    ware_house_group:this.editData.WarehouseGroup,

is_default_ware_house: this.editData.IsDefault,
 
// store_ware_house:this.editData.,
// in_transit_ware_house:this.editData.InTransitWarehouse,

// qaulity_ware_house:this.editData.,
// gate_entry:new FormControl(false),


  })
 }



  ngOnInit() {}
  addgodownForm = new FormGroup({
    ware_house_type: new FormControl('', Validators.required),
    sort_order: new FormControl('',Validators.required),
   ware_house_account_no: new FormControl('', Validators.required),
    ware_house_name: new FormControl('',Validators.required),
    short_description: new FormControl('',Validators.required),
    compony_alias_name:new FormControl('',Validators.required),
    pin: new FormControl('',Validators.required),
    address: new FormControl('',Validators.required),
    city: new FormControl('',Validators.required),
    gst_no: new FormControl('',Validators.required),
    tin_no: new FormControl('',Validators.required),
    cst_no: new FormControl('',Validators.required),
    cin_no: new FormControl(''),//optinal
    mobile_no: new FormControl('',Validators.required),
    email:new FormControl('',[Validators.required,Validators.email]),

    // cms_applicable: new FormControl(false),
    ware_house_group: new FormControl(''),
    is_default_ware_house: new FormControl(false),
 
store_ware_house: new FormControl(false),
in_transit_ware_house:new FormControl(false),

qaulity_ware_house:new FormControl(''),
gate_entry:new FormControl(false),



})


saveBankDetailsData(){
  let  data = [
    {
      "code": 0,
      "godownName": this.addgodownForm.value.ware_house_name,
      "isDefault": "string",
      "forStore": "string",
      "initialGoDownDesp": "string",
      "accountDesp": this.addgodownForm.value.ware_house_account_no,
      "department": "string",
      "address1": this.addgodownForm.value.address,
      "city": this.addgodownForm.value.city,
      "pinCode": this.addgodownForm.value.pin,
      "godownTINNo": this.addgodownForm.value.tin_no,
      "godownCSTNo": this.addgodownForm.value.cst_no,
      "godownCINNo": this.addgodownForm.value.cin_no,
      "godownMobileNo": this.addgodownForm.value.mobile_no,
      "godownEmail": this.addgodownForm.value.email,
      "godownFor": "string",
      "godownGSTNo": this.addgodownForm.value.gst_no,
      "godownSortOrder": 0,
      "gateEntryMandatory": "string",
      "showOnWeb": "string",
      "companyAliasName": this.addgodownForm.value.compony_alias_name,
      "forRejectedMaterial": "string",
      "warehouseGroup": this.addgodownForm.value.ware_house_group,
      "inTransitWarehouse": "y",
      "applicableInDispatch": "N",
      "userName": "string",
      "userMaster_Code": 0
    }
  ]
 
    this.godown.savewareHouses(data).subscribe({
      next: (res: any) => {
        this.toaser.showSuccess(res.Msg)
        
      },
      error: (err: any) => {
        this.toaser.showError(err.error.message)

        // console.log(err.error.message);
      }
    });
  

}
 checkEcms(value:any){

 }

 wareHouseList:any
 wareHouseType(){


 }

 getGodownData() {
  this.godown.getwarehouse('GetWarehouseAccountNameList').subscribe({
    next: (res: any) => {
      this.GetWarehouseAccountNameList=res
  
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
      country: this.getPincode?.CountryName ? this.getPincode?.CountryName :this.editData.Nation ? this.editData?.Nation :'',
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
