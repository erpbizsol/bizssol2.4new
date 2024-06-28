import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

export interface Order {
  itemName: any;
  size: any;
  thickness: any;
  qty : any;
  pcs: any;
}
export interface PaymantHistory {
  orderNo: any;
  orderDate: any;
  deliveryDate: any;
  invoiceNo : any;
  dispatchQty: any;
}
export interface TableData {
  partyName: string;
  orderNo: number;
  itemName: string;
  sizeDesp: string;
  balQtyPC: number;
  balQtyMT: number;
  balQtyMTRS: number;
}
const ELEMENT_DATA: TableData[] = [
  // Populate with actual data or fetch from a service
];
const PAYMENT_HISTORY_DATA: PaymantHistory[] = [
  // Populate with actual data or fetch from a service
];
@Component({
  selector: 'app-edit-visit-master',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, 
    HttpClientModule, 
    MatTableModule, 
    MatPaginatorModule, 
    MatSortModule, 
    MatButtonModule, 
    MatInputModule, 
    MatTooltipModule,
    MatFormFieldModule, 
    MatSelectModule, 
    FormsModule, 
    MatDatepickerModule,
    MatNativeDateModule,
    RouterModule],
  templateUrl: './edit-visit-master.component.html',
  styleUrl: './edit-visit-master.component.scss'
})
export class EditVisitMasterComponent {
  userForm: FormGroup;
  displayedSizeWiseColumns: string[] = ['itemName', 'size', 'thickness', 'qty', 'pcs'];
  displayedPaymentHistoryColumns: string[] = ['orderNo', 'orderDate', 'deliveryDate', 'invoiceNo', 'dispatchQty', 'dispatchDate', 'credeitDays', 'paymentDate', 'billAmmount', 'recieptPayemnt', 'otherReciept', 'oldPayment', 'balance', 'delayDays'];
  paymentHistoryDataSource = new MatTableDataSource<PaymantHistory>(PAYMENT_HISTORY_DATA);
    @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private fb: FormBuilder, private location: Location,) {
    this.userForm = this.fb.group({
      userName: ['MAHESH'],
      date: ['14-06-2024'],
      checkInTime: ['10:55'],
      location: ['HFWJ+3CR, Vadakkanchery - Padur Rd'],
      dealer: ['VINAYAKA IRON TRADERS'],
      attachment: [null],
      creditLimits: [3600000.00],
      creditDays: [25],
      overDueAmount: [1614394.00],
      outstanding: [1614394.00],
      targetAmount: [0.00],
      targetShortfall: [0.00],
      lastMonthSale: [20.28],
      currentMonthSale: [0.00],
      partyName: [''],
      stockQty: [0],
      saleQty: [0],
      price: [0.00],
      remarks: ['jhhjbjhbjhvmvhmckfyfyktfkufkuyfky'],
      additionalRemarks: ['ajhdihdihdiahdahdh'],
      nextVisitDate: ['2024-06-18'],
      estimatePad: [0, [Validators.required, Validators.min(0)]],
      brochures3Fold: [0, [Validators.required, Validators.min(0)]],
      tShirt: [0, [Validators.required, Validators.min(0)]],
      posters: [0, [Validators.required, Validators.min(0)]],
      paperWeight: [0, [Validators.required, Validators.min(0)]],
      tanglers: [0, [Validators.required, Validators.min(0)]],
      flyersStand: [0, [Validators.required, Validators.min(0)]],
      dairy: [0, [Validators.required, Validators.min(0)]],
      keyChain: [0, [Validators.required, Validators.min(0)]],
      anySuggestions: [0, [Validators.required, Validators.min(0)]],
      brochures2Fold: [0, [Validators.required, Validators.min(0)]],
      scribblePad: [0, [Validators.required, Validators.min(0)]],
      availability: [0],
      quality: [''],
      services: [0],
      teamSupport: [0],
      anyImprovement: [''],
      executiveRating: [''],
      stock: [0],
      branding: [0],
      creditLimit: [0],
      customerRating: [''],
      saleDate: ['2024-06-25'],
      itemName: [''],
      size: [''],
      thickness: [''],
      orderQty: [0],
      basicRate: [0],
      extraCharges: [0],
      orderRate: [0],
      amount: [0],
      deliveryDays: [2],
      freightType: ['Ex-Works'],
      discount: [0],
      finalRate: [0]
    });
  }
  displayedPendingOrderColumns: string[] = ['partyName', 'orderNo', 'itemName', 'sizeDesp', 'balQtyPC', 'balQtyMT', 'balQtyMTRS'];
  dataSource = new MatTableDataSource<TableData>(ELEMENT_DATA);
  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    this.userForm.patchValue({ attachment: file });
  }
  Cancel(){
    this.location.back();
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  
}
