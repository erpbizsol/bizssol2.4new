import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
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
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

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
// import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-route-plan',
  standalone: true,
  imports: [CommonModule, MatDatepickerModule, ReactiveFormsModule, FormsModule, ButtonDirective, ModalComponent, ModalHeaderComponent, ModalTitleDirective, ThemeDirective, ButtonCloseDirective, ModalBodyComponent, ModalFooterComponent, MatButtonModule, MatDialogModule, RouteDailogBoxComponent, HttpClientModule, MatDatepickerModule, MatTableModule, MatPaginatorModule],
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
  deltRoutePlan: any;
  dataSource = new MatTableDataSource<any>([]);


  @ViewChild(MatPaginator) paginator: MatPaginator;



  displayedColumns: string[] = ['sNo', 'visitType', 'dealerName', 'cityName', 'stateName', 'description', 'action'];

  constructor(private fb: FormBuilder, private elRef: ElementRef, public dialog: MatDialog, private _routePlanService: RoutePlanService) { }

  ngAfterViewInit() {
    // Use jQuery to select the element and initialize Select2
    // $(this.elRef.nativeElement).find("#select2drop").select2();
    this.dataSource.paginator = this.paginator;
  }


  // for date 
  ngOnInit() {
    // this.postRouteData();

    this.todayDate = new Date().toISOString().split('T')[0];
    this.getRoutePlan(this.todayDate)//UserMaster Code -- shesnath se pucho kha se aye ga herd code nhi chale ga usen iski service banyi h ok
  }

  onDateInputChange(event: any) {
    this.getRoutePlan(event.target.value)
    // Your onchange logic here
    console.log('Date changed!', event.target.value);
  }

  // postRouteData() {
  //   this.route.getPaymentList('getRoutePlanList').subscribe({
  //     next: (res: any) => {
  //       res.sort((a: any, b: any) => a.Code - b.Code);
  //       this.dataSource.data = res.reverse();
  //       this.dataSource.sort = this.sort;
  //       this.dataSource.paginator = this.paginator;
  //     },
  //     error: (err: any) => {
  //       console.log(err.error.message);
  //     }
  //   });
  // }

  // <!-------------Delete Department----------------->
  deleteRoutePlan(code: any): void {
    const dialogRef = this.dialog.open(DeleteConfermationPopUpComponent, {
      width: '375px',
      disableClose: true,
      data: { message: 'Are you sure you want to delete this followUp?', reason: '', code: code }
    });

    // dialogRef.afterClosed().subscribe(result => {
    //   this._routePlanService.postDeleteRoutePlan().subscribe(res => {
    //     this.deltRoutePlan = res;
    //     console.log(this.deltRoutePlan);
    //   })
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result && result.confirmed) {
    //     const reason = result.reason;
    //   }

    //   this._routePlanService.postDeleteRoutePlan(code, reason).subscribe(res => {
    //     console.log(`${code} has been deleted`);
    //     const responseObj = JSON.parse(JSON.stringify(res));
    //     this.postRouteData();
    //         alert(responseObj.Msg);

    //   })
    // });

  }


  // <!-------------Edit Department----------------->
  addDialog(value: any) {
    // console.log("hii", value)
    const dialogRef = this.dialog.open(RouteDailogBoxComponent, {
      disableClose: true,
      data: { data: value },
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getRoutePlan(new Date().toISOString().split('T')[0])
      console.log(`Dialog result: ${result}`);
    });
  }
  // <!------------- End Edit Department ----------------->


  // Date Formate 
  applyDate() { }

  getRoutePlan(PlanDate: any) {
    this._routePlanService.getRoutePlanList(PlanDate).subscribe(res => {
      this.dataSource = res

      // this.routePlanList = res;
      console.log("abc", this.dataSource);
    });
  }

  // Route Plan Dailog Form
  register(routeDailog: NgForm) {
    console.log(routeDailog.value);
  }

  // postDeleteRoutePlan

  postDelRoutePlan() {
    this._routePlanService.postDeleteRoutePlan().subscribe(res => {
      this.deltRoutePlan = res;
      console.log(this.deltRoutePlan);
    })
  }

}
