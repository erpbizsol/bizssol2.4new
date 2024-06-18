import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StateService } from 'src/app/services/Master/state.service';
import { CityService } from 'src/app/services/Master/city.service';
import { RoutePlanService } from 'src/app/services/Transaction/route-plan.service';

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
  routePlanForm: FormGroup;
  stateList: any;
  cityList: any;
  visittypehide: boolean = false;
  getRoutePlanVTDropDownList1: any = [];
  showDealerNameList: boolean = false;
  hideDealerNameList: boolean = true;
  dealerList: any = []
  saveRplan: any;

  constructor(private state: StateService, private city: CityService, private rPVTDList: RoutePlanService, private accountMaster: RoutePlanService, private saveRP: RoutePlanService) { }

  ngOnInit() {
    this.getState();
    this.getRoutePlanVTDropDownList();
    this.getAccountMDetails()

    this.routePlanForm = new FormGroup({
      visitType: new FormControl(''),
      dealerName: new FormControl(),
      city: new FormControl(),
      state: new FormControl(),
      description: new FormControl(),
    })
  }
  // Form
  registerRP() {
    console.log(this.routePlanForm);
  }

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
      this['cityList'] = res;
      console.log(this.getCityList);
    });
  }

  // Visit type dropdown list
  getRoutePlanVTDropDownList() {
    this.rPVTDList.getRoutePlanVistTypeDropDownList().subscribe(res => {
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
    this.accountMaster.getAccountMasterDetails().subscribe(res => {
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

  postSaveRoutePlan

  saveData() {
    console.log("hiii")
    debugger
    let data = [
      {
        code: 0,
        date: "",
        visitType: this.routePlanForm.value.visitType,
        cityName: this.routePlanForm.value.city,
        accountDesp: this.routePlanForm.value.visitType,
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
    this.saveRP.postSaveRoutePlan(data).subscribe({
      next: (res: any) => {
        // Handle the response here
        console.log("hiii");
      },
      error: (err: any) => {
        // Handle errors here

      }
    });
  }

}
