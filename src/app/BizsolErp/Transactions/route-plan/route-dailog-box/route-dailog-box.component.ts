import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StateService } from 'src/app/services/Master/state.service';
import { CityService } from 'src/app/services/Master/city.service';
import { RoutePlanService } from 'src/app/services/Transaction/route-plan.service';
import { ToasterService } from 'src/app/services/toaster-message/toaster.service';

@Component({
  selector: 'app-route-dailog-box',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, ReactiveFormsModule, CommonModule],
  providers: [StateService, CityService, RoutePlanService],
  templateUrl: './route-dailog-box.component.html',
  styleUrl: './route-dailog-box.component.scss'
})
export class RouteDailogBoxComponent {
  [x: string]: any;
  // routePlanForm: FormGroup;
  stateList: any = [];
  cityList: any = [];
  editData: any
  visittypehide: boolean = false;
  getRoutePlanVTDropDownList1: any = [];
  showDealerNameList: boolean = false;
  hideDealerNameList: boolean = true;
  dealerList: any = []
  saveRplan: any;
  RoutePlanMaster_Code: number = 0;
  EntryDate: any;
  routePBycode: any;

  // routePPLANbycode: any;
  // submitted: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toasrer:ToasterService,
    private dialogRef: MatDialogRef<RouteDailogBoxComponent>, private state: StateService, private city: CityService, private _routePlanService: RoutePlanService, private fb: FormBuilder) {
    this.editData = data.data
    // console.log(this.editData, "uuuuuuu")



  }

  ngOnInit() {
    this.getState();
    this.getRoutePlanVTDropDownList();
    this.getAccountMDetails()
    this.RoutePlanMaster_Code = this.data.routePlanMaster_Code;
    this.EntryDate = new Date().toISOString().split('T')[0];
    if (this.editData.Code !== undefined || '') {
      this.populateData()
      this.city.getCity(this.editData.StateName).subscribe(res => {
        this.cityList = res;
      });
    } 

    this._routePlanService.getRoutePlanList(new Date().toISOString().split('T')[0]).subscribe(res => { })
  }

  routePlanForm = this.fb.group({
    visitType: ['', [Validators.required]],
    dealerName: ['', [Validators.required]],
    city: ['', [Validators.required]],
    state: ['', [Validators.required]],
    description: ['', [Validators.required]],
  })
  populateData() {
    console.log(this.editData.Description, "kkkk")
    this.routePlanForm.patchValue({
      visitType: this.editData?.VisitType,
      description: this.editData?.Description,
      dealerName: this.editData?.DealerName,
      city: this.editData?.CityName,
      state: this.editData?.StateName,
    })
  }
  // Form
  registerRP() {
    console.log(this.routePlanForm);
  }

  // registerRP(): void {
  //   if (this.routePlanForm.valid) {
  //     const formData = this.routePlanForm.value;
  //     formData.code = this.code;
  //     formData.EnquiryMaster_Code = this.selectedRowData.EnquiryMaster_Code;

  //     if (!this.routePlanForm.get('showNextFollowup').value) {
  //       delete formData.NextFollowupMode;
  //       delete formData.NextFollowupDate;
  //     }

  //     this.followUpService.createFollowup(formData).subscribe(
  //       res => {
  //         this.toasterService.showSuccess('Follow Up updated successfully!');
  //         this.location.back();
  //       },
  //       err => {
  //         this.toasterService.showError('Failed to update Follow Up');
  //       }
  //     );
  //   } else {
  //     this.routePlanForm.markAllAsTouched();
  //   }
  // }



  // onUpdate(): void {
  //   if (this.routePlanForm.valid) {
  //     const formData = this.routePlanForm.value;
  //     formData.code = this.code;
  //     formData.EnquiryMaster_Code = this.selectedRowData.EnquiryMaster_Code;

  //     if (!this.routePlanForm.get('showNextFollowup').value) {
  //       delete formData.NextFollowupMode;
  //       delete formData.NextFollowupDate;
  //     }

  //     this.followUpService.createFollowup(formData).subscribe(
  //       res => {
  //         this.toasterService.showSuccess('Follow Up updated successfully!');
  //         this.location.back();
  //       },
  //       err => {
  //         this.toasterService.showError('Failed to update Follow Up');
  //       }
  //     );
  //   } else {
  //     this.routePlanForm.markAllAsTouched();
  //   }
  // }



  // state
  getState() {
    const selectedValue = 'India'
    this.state.getStates(selectedValue).subscribe((res: any) => {
      this.stateList = res;
      console.log(this.stateList);
      // console.log(this.stateList,"hii");
    })
  }

  // City
  getCityList(event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.city.getCity(selectedValue).subscribe((res: any) => {
      this.cityList = res;
      console.log(this.getCityList);
    });
  }
  // Visit type dropdown list
  getRoutePlanVTDropDownList() {
    this._routePlanService.getRoutePlanVistTypeDropDownList().subscribe(res => {
      this.getRoutePlanVTDropDownList1 = res;
    })
  }
  appearDealerInputBox(event: any) {
    const abc = event.target.value;
    if (abc == this.getRoutePlanVTDropDownList1[1].Desp) {
      this.showDealerNameList = true;
      this.hideDealerNameList = false;
    } else {
      this.showDealerNameList = false;
      this.hideDealerNameList = true;
    }
  }
  //Dealer Name
  getAccountMDetails() {
    this._routePlanService.getAccountMasterDetails().subscribe(res => {
      this.dealerList = res;
      console.log("dealer List", this.dealerList);
    })
  }

  //SAVE ROUTE PLAN  
 // postSaveRPlan(){
  //   this.saveRP.postSaveRoutePlan().subscribe(res => {
  //     this.saveRplan = res;
  //     console.log("saveRplan", this.saveRplan);
  //   })  
  // }

  // postSaveRoutePlan

  submitted:boolean = false
  saveData() {
    this.submitted= true
    debugger

    if (this.routePlanForm.invalid) {
      return
    }

    let data = [
      {
        code: this.editData.Code ? this.editData.Code :this.RoutePlanMaster_Code , 
        date: this.EntryDate,
        visitType: this.routePlanForm.value.visitType,
        cityName: this.routePlanForm.value.city,
        accountDesp: this.routePlanForm.value.dealerName,
        stateName: this.routePlanForm.value.state,
        description: this.routePlanForm.value.description,
        dealerName: this.routePlanForm.value.dealerName,
        userName: "",
        verifiedRejectedBy: 0,
        verifiedRejectedOn: "",
        closed: "N",
        closedOn: "",
        closedReason: "",
        rejectedReason: ""
      }
    ]
    // const formData = this.routePlanForm.value;


    
    if (this.editData?.Code == undefined || ''||0 ){
      
      this._routePlanService.postSaveRoutePlan(data).subscribe(
        response => {
          console.log("hiihhhh")
          console.log('Data saved successfully:', response);
  
          this.dialogRef.close();
        },
        error => {
          // Handle error during save
          console.error('Error saving data:', error);
        }
  
  
      );}
      else{
        this._routePlanService.postSaveRoutePlan(data).subscribe(
          response => {
            console.log('Data saved successfully:', response);
            this.toasrer.showSuccess(response.Msg)
    
            this.dialogRef.close();
          },
          error => {
            // Handle error during save
            console.error('Error saving data:', error);
          }
    
    
        );
      }

  }
  

  // UPDATE ROUTE PLAN
  getRoutePBycode(RoutePlanMaster_Code: number) {
    this._routePlanService.getRoutePlanByCode(RoutePlanMaster_Code).subscribe(res => {
      this.routePBycode = res.reverse();
      console.log("routePBycode", this.routePBycode);
    })
  }
}
