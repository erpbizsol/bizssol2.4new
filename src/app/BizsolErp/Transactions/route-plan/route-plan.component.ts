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
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {provideNativeDateAdapter} from '@angular/material/core';


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
import { RoutePlanService } from 'src/app/services/Master/route-plan.service';

@Component({
  selector: 'app-route-plan',
  standalone: true,
  imports: [CommonModule,MatDatepickerModule, ReactiveFormsModule, FormsModule, ButtonDirective, ModalComponent, ModalHeaderComponent, ModalTitleDirective, ThemeDirective, ButtonCloseDirective, ModalBodyComponent, ModalFooterComponent, MatButtonModule, MatDialogModule, RouteDailogBoxComponent, HttpClientModule,MatDatepickerModule],
  providers: [RoutePlanService],
  templateUrl: './route-plan.component.html',
  styleUrl: './route-plan.component.scss'
})
export class RoutePlanComponent implements AfterViewInit {

  public visible = false;
  todayDate: any;
  routePlanList: any;
  constructor(private fb: FormBuilder, private elRef: ElementRef, public dialog: MatDialog, private _routePlanService: RoutePlanService) { }

  ngAfterViewInit() {
    // Use jQuery to select the element and initialize Select2
    $(this.elRef.nativeElement).find("#select2drop").select2();
  }


  ngOnInit() {
    // var today=new Date();
    this.getRoutePlan('30-apr-2024','7075')
    this.todayDate = new Date().toISOString().split('T')[0];

  }

  // <!-------------Add Department----------------->
  // openDialog() {
  //   const dialogRef = this.dialog.open(RouteDailogBoxComponent);
  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log(`Dialog result: ${result}`);
  //   });
  // }

  openDialog() {
    const dialogRef = this.dialog.open(RouteDailogBoxComponent, {
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  // <!-------------Edit Department----------------->
  toggleEditDemo() {
    this.visible = !this.visible;
  }

  handleEditDemoChange(event: any) {
    this.visible = event;
  }

// Date Formate 
applyDate(){}


  // Service Call 
  // processList2() {
  //   this._heatTreatmentService.postHeatTreatment().subscribe(res => {
  //     this.processList = res;
  //     console.log(this.processList);
  //   });
  // }


  getRoutePlan(PlanDate:any, UserMaster_Code:any) {
    this._routePlanService.getRoutePlanList(PlanDate,UserMaster_Code).subscribe(res => {
      this.routePlanList = res;
      console.log(this.routePlanList);
    });
  }

  // Route Plan Dailog Form
  register(routeDailog:NgForm){
    console.log(routeDailog.value);
  }

}
