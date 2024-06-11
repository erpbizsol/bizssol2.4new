import { CommonModule } from '@angular/common';
import { Component, ViewChild, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { RouterModule } from '@angular/router';
import { ContainerComponent, HeaderTogglerDirective, SidebarToggleDirective, HeaderNavComponent, NavItemComponent, NavLinkDirective, BreadcrumbRouterComponent, ThemeDirective, DropdownComponent, DropdownToggleDirective, TextColorDirective, AvatarComponent } from '@coreui/angular';
// import { NewFollowUpComponent } from '../create-new-followup/new-follow-up/new-follow-up.component';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { UrlService } from '../.././../services/URL/url.service';
import { HeatTreatmentService } from '../.././../services/Master/heat-treatment.service';

@Component({
  selector: 'app-heat-treatment',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatTableModule, MatButtonModule, MatAutocompleteModule, MatFormFieldModule, MatInputModule, HttpClientModule, MatTableModule, MatPaginatorModule, MatSortModule, MatButtonModule, MatInputModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, FormsModule, RouterModule, ContainerComponent, HeaderTogglerDirective, SidebarToggleDirective, HeaderNavComponent, NavItemComponent, NavLinkDirective, BreadcrumbRouterComponent, ThemeDirective, DropdownComponent, DropdownToggleDirective, TextColorDirective, AvatarComponent],
  templateUrl: './heat-treatment.component.html',
  styleUrl: './heat-treatment.component.scss',
  providers: [ HeatTreatmentService]
})

export class HeatTreatmentComponent implements OnInit {

 
  displayedColumns: string[] = [
    'SN',           // call API
    'WorkOrderNo',
    'ItemSRNo',
    'ItemDescription',
    'OverdueFollowupDays',
    'OrderQty',
    'BalQty',
    'HeatNo',
    'GLNO',
    'RawMaterialSize',
    'MaterialWt',
    'CutWtPc',
    'Action'
  ];

  columnDisplayNames: { [key: string]: string } = {
    'SN': 'SN',
    'WorkOrderNo': 'Work Order No',   // 'FollowupDate'-(API Data): 'FollowUp Date' - Heading
    'ItemSRNo': 'Item SR No',
    'ItemDescription': 'Item Description',
    'OverdueFollowupDays': 'Grade',
    'OrderQty':'Overdue Followup Daysrder Qty',
    'BalQty':'Bal Qty',
    'HeatNo':'Heat No',
    'GLNO':'Gl No',
    'RawMaterialSize':'Raw Material Size',
    'MaterialWt':'Material Wt',
    'CutWtPc':'Cut Wt/PC',
    'Action': 'Action'
  };

  dataSource: MatTableDataSource<any>;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  //End Pagination table
  heatTreatmentForm: FormGroup;
  myControl = new FormControl('');
  heatTreatmentList: any[];
  processList: any[];
  machineNo: any[];
  tableRows: any;
  // fb: any;
  showTable: any;
  // dataSource: any;
  // @ViewChild(MatSort) sort: MatSort;
  // @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private fb: FormBuilder, private _http: HttpClient, private _urlService: UrlService, private _heatTreatmentService: HeatTreatmentService) {
    const staticData = [
      { SN: 1, WorkOrderNo: '2023-05-01', ItemSRNo: '2023-04-25', ItemDescription: 'Phone', OverdueFollowupDays: 5, OrderQty: false, BalQty: 'abc', HeatNo: 78, GLNO: 99, RawMaterialSize:'xyz',MaterialWt:'text',CutWtPc:'abc',Action:'' },
      { SN: 2, WorkOrderNo: '2023-05-01', ItemSRNo: '2023-04-25', ItemDescription: 'Phone', OverdueFollowupDays: 5, OrderQty: false, BalQty: 'abc', HeatNo: 78, GLNO: 99, RawMaterialSize:'xyz',MaterialWt:'text',CutWtPc:'abc',Action:'' },
      { SN: 3, WorkOrderNo: '2023-05-01', ItemSRNo: '2023-04-25', ItemDescription: 'Phone', OverdueFollowupDays: 5, OrderQty: false, BalQty: 'abc', HeatNo: 78, GLNO: 99, RawMaterialSize:'xyz',MaterialWt:'text',CutWtPc:'abc',Action:'' },
      // Add more static data as needed
    ];

    this.dataSource = new MatTableDataSource(staticData);
   }
  // Reactive Form 
  ngOnInit() {
    //  p({
    //   planDate: new FormControl('', Validators.required),
    //   batchNo: new FormControl(''),
    //   process: new FormControl(''),
    //   machineNo: new FormControl(''),
    // })

    this.GetprocessList();
    // this.heatTreatment()
    this.heatTreData();
    


    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
    // this.getEnquiryFollowUpList()

    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

  }

  heatTreData() {
    const today = new Date().toISOString().split('T')[0];
    this.heatTreatmentForm = this.fb.group({
      planDate: [today, Validators.required],
      batchNo: new FormControl(''),
      process: new FormControl(''),
      machineNo: new FormControl(''),
      // FollowupMode: ['email', Validators.required],
      // nextFollowupMode: ['email', Validators.required],
      // nextFollowupDate: ['', Validators.required],
      // ourRemarks: ['', Validators.required],
      // customerRemarks: ['', Validators.required],
      // CustomerContactPersonName: [''] 
    });
  }
  //for table
  // Assume 'element' contains the data of the row
  // editRow(element: any): void {
  //   element.editable = !element.editable; // Toggle the 'editable' property
  // }


  // deleteRow(row: any): void {
  //   // Implement delete logic here
  //   console.log('Delete row:', row);
  // }

  addNewRow(): void {
    const newRow = {
      SN: this.dataSource.data.length + 1,
      FollowupDate: '', // Initialize with default values
      LastFollowupDate: '',
      FollowupMode: '',
      OverdueFollowupDays: 0,
      editable: true // New row should be editable
    };
    this.dataSource.data = [...this.dataSource.data, newRow]; // Add new row
  }

  editRow(element: any): void {
    element.editable = !element.editable;
    
  }

  deleteRow(row: any): void {
    const index = this.dataSource.data.indexOf(row);
    if (index > -1) {
      this.dataSource.data.splice(index, 1);
      this.dataSource = new MatTableDataSource(this.dataSource.data);
    }
  }
  // end table
  register(formdata: FormGroup) {
    console.log(formdata.value);
  }
  //End Reactive Form 

  // Input box with dropdown
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;


  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  // Service call 
  // processList2() {
  //   this._heatTreatmentService.postHeatTreatment().subscribe(res => {
  //     this.processList = res;
  //     console.log(this.processList);
  //   });
  // }

  // machine2() {
  //   this._heatTreatmentService.postHeatTreatment().subscribe(res => {
  //     this.machineNo = res;
  //     console.log(this.machineNo);
  //   });
  // }


  GetprocessList() {
    this._heatTreatmentService.GetHeatTreatmentDropDownList('Plan', 'GET_PROCESSLIST', '0', '').subscribe(res => {
      this.processList = res;
      console.log(this.processList);
    });
  }

  GetmachineNo(Value) {

    this._heatTreatmentService.GetHeatTreatmentDropDownList('Plan', 'GET_MACHINELIST', Value, '').subscribe(res => {
      this.machineNo = res;
      console.log(this.machineNo);
    });
  }

  // postHeatTreatment() {
  //   this._heatTreatmentService.GetHeatTreatmentDropDownList('Plan', 'GET_PROCESSLIST', '0', '').subscribe(res => {
  //     this.processList = res;
  //     console.log(this.processList);
  //   });
  // }

  // heatTreatment() {
  //   this._heatTreatmentService.GetHeatTreatmentDropDownList('Plan', 'GET_WORKORDERNOLIST', '0', '').subscribe(res => {
  //     this.heatTreatmentList = res;
  //     console.log(this.heatTreatmentList);
  //   });
  // }

  getProcess(event) {
    this._heatTreatmentService.GetHeatTreatmentDropDownList('Plan', 'GET_PROCESSLIST', '0', '').subscribe(res => {
      this.processList = res;
      console.log(this.processList);
    });
  }

  // getMachine(event){
  //   this._heatTreatmentService.GetHeatTreatmentDropDownList('Plan', 'GET_MACHINELIST', '0', '').subscribe(res => {
  //     this.processList = res;
  //     console.log(this.processList);
  //   });
  // }

  // Machine No 
  OnChange_ddlprocess(event: any) {
    // Your logic to handle the change event goes here
    var Value = event.target.value;
    this.GetmachineNo(Value)

  }

}




