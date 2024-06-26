import { FormControl, FormGroup, ReactiveFormsModule, Validators, FormBuilder, FormArray } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, Inject, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { HSNCodeMasterService } from 'src/app/services/Master/hsn-code-master.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

interface DataElement {
  ApplicableDate1: string;
  MEISRate: number;
  DBKRate: number;
}
interface DataElement2 {
  ApplicableDate2: string;
  Rate: number;
  SpecialRate: number;
  CessRate: number;
}

@Component({
  selector: 'app-add-hsn-code-master',
  standalone: true,
  imports: [CommonModule, MatInputModule, MatButtonModule, MatFormFieldModule, MatTabsModule, MatTableModule, MatPaginatorModule, ReactiveFormsModule,
    HttpClientModule, MatSortModule],
  templateUrl: './add-hsn-code-master.component.html',
  styleUrls: ['./add-hsn-code-master.component.scss'],
  providers: [HSNCodeMasterService]
})
export class AddHSNCodeMasterComponent implements OnInit {
  displayedColumns1: string[] = ['sNo', 'ApplicableDate1', 'MEISRate', 'DBKRate'];
  displayedColumns2: string[] = ['sNo', 'ApplicableDate2', 'Rate', 'SpecialRate', 'CessRate'];

  // dataSource1 = new MatTableDataSource<DataElement>([]);
  // dataSource2 = new MatTableDataSource<DataElement2>([]);

  newHSNCodeForm: FormGroup;
  tabIndex: number = 0;

  @ViewChild('paginator1') paginator1!: MatPaginator;
  @ViewChild('paginator2') paginator2!: MatPaginator;
  elementData: any;
  i: string | number;

  constructor(
    private dialogRef: MatDialogRef<AddHSNCodeMasterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private _HSNCodeMasterService: HSNCodeMasterService
  ) {
    this.elementData = data.element;

    this.newHSNCodeForm = this.fb.group({
      Code: ['0'],
      HSNCode: ['', Validators.required],
      ProductionDescription: ['', Validators.required],
      dataSource1: this.fb.array([]),
      dataSource2: this.fb.array([])
    });

    // this.addDataSource1Item();
    // this.addDataSource2Item();
  }
  ngOnInit(): void {
    this.addRow();
    this.addRow2();
  }

  // ngAfterViewInit() {
  //   this.dataSource1.paginator = this.paginator1;
  //   this.dataSource2.paginator = this.paginator2;
  // }

  get dataSource1(): FormArray {
    return this.newHSNCodeForm.get('dataSource1') as FormArray;
  }

  get dataSource2(): FormArray {
    return this.newHSNCodeForm.get('dataSource2') as FormArray;
  }

  // createDataSource1Item(): FormGroup {
  //   return this.fb.group({
  //     ApplicableDate1: ['', Validators.required],
  //     MEISRate: ['', Validators.required],
  //     DBKRate: ['', Validators.required]
  //   });
  // }

  // createDataSource2Item(): FormGroup {
  //   return this.fb.group({
  //     ApplicableDate2: ['', Validators.required],
  //     Rate: ['', Validators.required],
  //     SpecialRate: ['', Validators.required],
  //     CessRate: ['', Validators.required]
  //   });
  // }
  addRow() {
    this.dataSource1.push(this.fb.group({
      ApplicableDate1: ['', Validators.required],
      MEISRate: ['', Validators.required],
      DBKRate: ['', Validators.required]
    }));
  }
  addRow2() {
    this.dataSource2.push(this.fb.group({
      ApplicableDate2: ['', Validators.required],
      Rate: ['', Validators.required],
      SpecialRate: ['', Validators.required],
      CessRate: ['', Validators.required]
    }));
  }
  // addDataSource1Item(): void {
  //   this.dataSource1Array.push(this.createDataSource1Item());
  //   ApplicableDate2: ['', Validators.required],
  //   Rate: ['', Validators.required],
  //   SpecialRate: ['', Validators.required],
  //   CessRate: ['', Validators.required]
  //   this.dataSource1.data = this.dataSource1Array.controls.map(control => control.value);
  // }

  // addDataSource2Item(): void {
  //   this.dataSource2Array.push(this.createDataSource2Item());
  //   this.dataSource2.data = this.dataSource2Array.controls.map(control => control.value);
  // }

  // removeDataSource1Item(index: number): void {
  //   this.dataSource1Array.removeAt(index);
  //   this.dataSource1.data = this.dataSource1Array.controls.map(control => control.value);
  // }

  // removeDataSource2Item(index: number): void {
  //   this.dataSource2Array.removeAt(index);
  //   this.dataSource2.data = this.dataSource2Array.controls.map(control => control.value);
  // }

  getTabIndex(event: any) {
    this.tabIndex = event;
    console.log('Selected tab index:', this.tabIndex);
  }

  allowAlphabetsOnly(event: KeyboardEvent): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if ((charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122) || charCode === 32 || charCode === 8) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  allowNumberOnly(event: KeyboardEvent): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if ((charCode >= 48 && charCode <= 57) || charCode === 46 || charCode === 8) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  validateInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    const regex = /^\d*\.?\d{0,2}$/;
    if (!regex.test(value)) {
      input.value = value.slice(0, -1);
    }
  }

  saveHSNCode() {
    // if (this.newHSNCodeForm.invalid) {
    //   console.error('Form is invalid');
    //   return;
    // }
    const formValues = this.newHSNCodeForm.getRawValue();
    const Obj = {
      hsnCodeMaster: 
        {
        code: formValues.Code === '' ? '0' : formValues.Code,
        hsnCode: formValues.HSNCode,
        productDesp: formValues.ProductionDescription,
        userMaster_Code: 0
      }
    ,
      hsnCodeDetails: formValues.dataSource2.map((row: any) => ({
        code: formValues.Code === '' ? '0' : formValues.Code,
        hsnCodeMaster_Code: 0,
        applicableDate: row.ApplicableDate2,
        rates: row.Rate,
        specialRate: row.SpecialRate,
        rates2: row.CessRate,
      })),
      hsnCodeExportRateBenefitDetail: formValues.dataSource1.map((row: any) => ({
        code: formValues.Code === '' ? '0' : formValues.Code,
        hsnCodeMaster_Code: 0,
        applicableDate: row.ApplicableDate1,
        meisRate: row.MEISRate,
        dbkRate: row.DBKRate,
      }))
    };
    console.log(Obj);

    this._HSNCodeMasterService.saveHSNCode(Obj).subscribe({
      next: (res: any) => {
        let obj = JSON.stringify(res);
        let responseObject = JSON.parse(obj);
        alert(responseObject.Msg);
        console.log(res);
      },
      error: (err: any) => {
        console.error('Error saving HSN Code:', err);
        alert('Failed to save HSN Code.');
      }
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}