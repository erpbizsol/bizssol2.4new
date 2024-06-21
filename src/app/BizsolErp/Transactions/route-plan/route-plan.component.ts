import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef } from '@angular/core';
import { FormBuilder, NgForm, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { RouteDailogBoxComponent } from '../route-plan/route-dailog-box/route-dailog-box.component';
import { HttpClientModule } from '@angular/common/http';
import $ from "jquery";
import "select2";
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';


declare var $: any;
import {
  ButtonCloseDirective,
  ButtonDirective,
  ModalBodyComponent,
  ModalComponent,
  ModalFooterComponent,
  ModalHeaderComponent,
  ModalTitleDirective,
  ThemeDirective,
  // MatFormFieldModule, MatInputModule,

} from '@coreui/angular';
import { RoutePlanService } from 'src/app/services/Transaction/route-plan.service';
import { DeleteConfermationPopUpComponent } from 'src/app/pop-up/delete-confermation/delete-confermation-pop-up/delete-confermation-pop-up.component';

@Component({
  selector: 'app-route-plan',
  standalone: true,
  imports: [CommonModule, MatDatepickerModule, ReactiveFormsModule, FormsModule, ButtonDirective, ModalComponent, ModalHeaderComponent, ModalTitleDirective, ThemeDirective, ButtonCloseDirective, ModalBodyComponent, ModalFooterComponent, MatButtonModule, MatDialogModule, RouteDailogBoxComponent, HttpClientModule, MatDatepickerModule],
  providers: [RoutePlanService],
  templateUrl: './route-plan.component.html',
  styleUrl: './route-plan.component.scss'
})
export class RoutePlanComponent implements AfterViewInit {

  // public visible = false;
  todayDate: any;
  routePlanList: any;
  element: any;
  routemastercode: any;
  // userMasterCode: any;
  constructor(private fb: FormBuilder, private elRef: ElementRef, public dialog: MatDialog, private _routePlanService: RoutePlanService) { }

  ngAfterViewInit() {
    // Use jQuery to select the element and initialize Select2
    $(this.elRef.nativeElement).find("#select2drop").select2();
  }


  // for date 
  ngOnInit() {
    this.todayDate = new Date().toISOString().split('T')[0];
    this.getRoutePlan(this.todayDate)//UserMaster Code -- shesnath se pucho kha se aye ga herd code nhi chale ga usen iski service banyi h ok
  }

  onDateInputChange(event: any) {
    this.getRoutePlan(event.target.value)
    // Your onchange logic here
    console.log('Date changed!', event.target.value);
  }

 // <!-------------Delete Department----------------->
 deleteRoutePlan(Code: any): void {
  const dialogRef = this.dialog.open(DeleteConfermationPopUpComponent, {
    width: '375px',
    data: { message: 'Are you sure you want to delete this followUp?', reason: '', code: Code }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result && result.confirmed) {
      const reason = result.reason;
      
    }
  });
}



  // <!-------------Edit Department----------------->
  addDialog(value: any) {
  console.log(
    value,"kkk"
  );
  
    const dialogRef = this.dialog.open(RouteDailogBoxComponent, {
      disableClose: true,
      data: { routePlanMaster_Code: value },
    });

    dialogRef.afterClosed().subscribe(result => {
      this.routemastercode=result.code;
     
    this.getRoutePlan(new Date().toISOString().split('T')[0])
      console.log(`Dialog result: ${result}`);
    });
  }
  // <!------------- End Edit Department----------------->


  // Date Formate 
  applyDate() { }


  // Service Call 
  // processList2() {
  //   this._heatTreatmentService.postHeatTreatment().subscribe(res => {
  //     this.processList = res;
  //     console.log(this.processList);
  //   });
  // }


  getRoutePlan(PlanDate: any) {
    this._routePlanService.getRoutePlanList(PlanDate).subscribe(res => {
      this.routePlanList = res;
      console.log(this.routePlanList);
    });
  }

  // Route Plan Dailog Form
  register(routeDailog: NgForm) {
    console.log(routeDailog.value);
  }

}
