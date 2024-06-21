import { FormControl, FormGroup, ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, Inject, ViewChild, AfterViewInit } from '@angular/core';
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
export class AddHSNCodeMasterComponent implements AfterViewInit {
  displayedColumns1: string[] = ['sNo', 'ApplicableDate1', 'MEISRate', 'DBKRate'];
  displayedColumns2: string[] = ['sNo', 'ApplicableDate2', 'Rate', 'SpecialRate', 'CessRate'];

  elementData: any;
  submitted: boolean = false;

  dataSource1 = new MatTableDataSource<DataElement>([
    { ApplicableDate1: '2024-01-01', MEISRate: 5, DBKRate: 2 },
  ]);
  dataSource2 = new MatTableDataSource<DataElement2>([
    { ApplicableDate2: '2024-01-01', Rate: 5, SpecialRate: 2, CessRate: 1 },
  ]);

  newHSNCodeForm: FormGroup;

  @ViewChild('paginator1') paginator1!: MatPaginator;
  @ViewChild('paginator2') paginator2!: MatPaginator;


  constructor(
    private dialogRef: MatDialogRef<AddHSNCodeMasterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _HSNCodeMasterService: HSNCodeMasterService, private fb: FormBuilder) 
    {
    this.elementData = data.element;
    this.newHSNCodeForm = new FormGroup({
      Code: new FormControl('0'),
      HSNCode: new FormControl('', [Validators.required]),
      ProductionDescription: new FormControl('', [Validators.required]),
      ApplicableDate1: new FormControl('', [Validators.required]),
      MEISRate: new FormControl('', [Validators.required]),
      DBKRate: new FormControl('', [Validators.required]),
      ApplicableDate2: new FormControl('', [Validators.required]),
      Rate: new FormControl('', [Validators.required]),
      SpecialRate: new FormControl('', [Validators.required]),
      CessRate: new FormControl('', [Validators.required])
    });
  }

  NgOnInIt() {
    this.getTabIndex({});
  }
  ngAfterViewInit() {
    this.dataSource1.paginator = this.paginator1;
    this.dataSource2.paginator = this.paginator2;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  tabIndex: number = 0
  getTabIndex(event: any) {
    this.tabIndex = event;
    console.log('Selected tab index:', this.tabIndex);
    if (this.tabIndex == 0) {
    }
    else if (this.tabIndex == 1) {
    }
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
    // this.submitted = true
    // if (this.newHSNCodeForm.invalid) {
    //   return
    // }
    const formValues = this.newHSNCodeForm.getRawValue();
    const Obj = {
      hsnCodeDetails: formValues.tableRows2.map((row: any) => ({
        code: formValues.Code === "" ? '0' : formValues.Code,
        hsnCodeMaster_Code: 0,
        applicableDate: row.ApplicableDate2,
        rates: row.Rate,
        specialRate: row.SpecialRate,
        rates2: row.CessRate,
        // amountForRate: row.amountForRate,
      })),
      hsnCodeExportRateBenefitDetail: formValues.tableRows1.map((row: any) => (
        {
          code: formValues.Code === "" ? '0' : formValues.Code,
          hsnCodeMaster_Code: 0,
          applicableDate: row.ApplicableDate1,
          meisRate: row.MEISRate,
          dbkRate: row.DBKRate,
          UserMaster_Code: 141
        }
      )),
      hsnCodeMaster: [
        {
          code: formValues.Code === "" ? '0' : formValues.Code,
          hsnCode: formValues.HSNCode,
          productDesp: formValues.ProductionDescription,
          userMaster_Code: 0
        }
      ]
    };

    this._HSNCodeMasterService.saveHSNCode(Obj).subscribe({
      next: (res: any) => {
        let obj = JSON.stringify(res);
        let responseObject = JSON.parse(obj);
        alert(responseObject.Msg);
        console.log(res);

      },
      error: (err: any) => {
        console.error('Error saving tank daily stock:', err);
        alert('Failed to save tank daily stock.');
      }
    });
  }
}