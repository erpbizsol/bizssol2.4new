import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { AddHSNCodeMasterComponent } from 'src/app/BizsolErp/Masters/hsn-code-component/add-hsn-code-master/add-hsn-code-master.component';
import { DeleteConfermationPopUpComponent } from 'src/app/pop-up/delete-confermation/delete-confermation-pop-up/delete-confermation-pop-up.component';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { HSNCodeMasterService } from 'src/app/services/Master/hsn-code-master.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-hsn-code-component',
  standalone: true,
  imports: [HttpClientModule,MatTableModule,MatPaginatorModule, CommonModule],
  templateUrl: './hsn-code-component.component.html',
  styleUrl: './hsn-code-component.component.scss',
  providers:[HSNCodeMasterService]
})
export class HSNCodeMasterComponent implements OnInit {
  @ViewChildren('levelInput') levelInputs!: QueryList<ElementRef>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  newHSNCodeForm: FormGroup;
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['sNo', 'HSNCode','ProductDescription', 'action'];

  constructor(private hsnCodeService :HSNCodeMasterService,private fb:FormBuilder, public dialog: MatDialog) {}


  ngOnInit(): void {
    this.newHSNCodeForm = this.fb.group({
      HSNCode: ['', Validators.required],
      ProductionDescription: ['', Validators.required],
      Code: [0],
      tableRows1: this.fb.array([this.createTableRow1()]),
      tableRows2: this.fb.array([this.createTableRow2()])
    });
  }

  get tableRows1(): FormArray {
    return this.newHSNCodeForm.get('tableRows1') as FormArray;
  }

  get tableRows2(): FormArray {
    return this.newHSNCodeForm.get('tableRows2') as FormArray;
  }

  createTableRow1(): FormGroup {
    return this.fb.group({
      ApplicableDate: ['', Validators.required],
      MEISRate: ['', Validators.required],
      DBKRate: ['', Validators.required]
    });
    // Focus the new row's first input element
    // setTimeout(() => {
    //   this.focusNewRow();
    // });
  }

  createTableRow2(): FormGroup {
    return this.fb.group({
      ApplicableDate: ['', Validators.required],
      Rate: ['', Validators.required],
      SpecialRate: ['', Validators.required],
      CessRate: ['', Validators.required]
    });
    // Focus the new row's first input element
    // setTimeout(() => {
    //   this.focusNewRow();
    // });
  }

  loadHSNCodeData(): void {
    this.hsnCodeService.getHSNCodeMaterList().subscribe((data: any) => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  saveHSNCode(): void {
    const formValues = this.newHSNCodeForm.getRawValue();
    const Obj = {
      hsnCodeDetails: formValues.tableRows2.map((row: any) => ({
        code: formValues.Code === "" ? '0' : formValues.Code,
        hsnCodeMaster_Code: 0,
        applicableDate: row.applicableDate,
        rates: row.rates,
        specialRate: row.specialRate,
        rates2: row.rates2,
        // amountForRate: row.amountForRate,
      })),
      hsnCodeExportRateBenefitDetail: formValues.tableRows1.map((row: any) => (
        {
          code: formValues.Code === "" ? '0' : formValues.Code,
          hsnCodeMaster_Code: 0,
          applicableDate: row.applicableDate,
          meisRate: row.meisRate,
          dbkRate: row.dbkRate,
          UserMaster_Code: 141
        }
      )),
      hsnCodeMaster: [
        {
          code: formValues.Code === "" ? '0' : formValues.Code,
          hsnCode: formValues.date,
          productDesp: formValues.date,
          userMaster_Code: 0
        }
      ]
    };

    this.hsnCodeService.saveHSNCode(Obj).subscribe({
      next: (res: any) => {
        alert(res.Msg);
        this.loadHSNCodeData();
      },
      error: (err: any) => {
        console.error('Error saving HSN Code:', err);
        alert('Failed to save HSN Code.');
      }
    });
  }

  deleteHSNCodeMaster(code: number) {
    const dialogRef = this.dialog.open(DeleteConfermationPopUpComponent, {
      width: '375px',
      disableClose:true,
      data: { message: 'Are you sure you want to delete this State?', reason: '', code: code }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.confirmed) {
        const reason = result.reason;
        this.hsnCodeService.deleteHSNCode(code, reason).subscribe({
          next: (res: any) => {
            const responseObj = JSON.parse(JSON.stringify(res));
            alert(responseObj.Msg);
            this.loadHSNCodeData();
          },
          error: (err: any) => {
            console.error('Error deleting HSN Code:', err);
            alert('Failed to delete HSN Code.');
          }
        });
      }
    });
}

  addDialog(value: any) {
    const dialogRef = this.dialog.open(AddHSNCodeMasterComponent, {
      width: '1000px',
      height: '500px',
      disableClose: true,
      data :{element:value}
      });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.loadHSNCodeData();
      }
    });
  }
}

