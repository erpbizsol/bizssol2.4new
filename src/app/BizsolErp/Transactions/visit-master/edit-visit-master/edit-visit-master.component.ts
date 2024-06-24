import { Component } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';

interface Order {
  id: number;
  prodname: string;
  address: string;
  location: string;
  items: number;
  size: string;
}
@Component({
  selector: 'app-edit-visit-master',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './edit-visit-master.component.html',
  styleUrl: './edit-visit-master.component.scss'
})
export class EditVisitMasterComponent {
  userForm: FormGroup;
  pendingOrders: MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'prodname', 'address', 'location', 'items', 'size'];


  constructor(private fb: FormBuilder, private location: Location,) {
    this.pendingOrders = new MatTableDataSource([
      { id: 1, prodname: 'Product A', address: '123 Main St', location: 'Location 1', items: 10, size: 'Large' },
      { id: 2, prodname: 'Product B', address: '456 Elm St', location: 'Location 2', items: 5, size: 'Medium' }
    ]);
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
      remarks: [''],
      additionalRemarks: [''],
      nextVisitDate: ['2024-06-18']
    });
  }

  ngOnInit(): void {}

  onFileChange(event: any) {
    const file = event.target.files[0];
    this.userForm.patchValue({ attachment: file });
  }
  Cancel(){
    this.location.back();
  }
}
