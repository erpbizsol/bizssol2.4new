import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { HSNCodeMasterService } from 'src/app/services/Master/hsn-code-master.service';


@Component({
  selector: 'app-add-hsn-code-master',
  standalone: true,
  imports: [CommonModule, MatPaginatorModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './add-hsn-code-master.component.html',
  styleUrls: ['./add-hsn-code-master.component.scss'],
  providers: [HSNCodeMasterService, DatePipe]
})
export class AddHSNCodeMasterComponent implements OnInit {
  @ViewChild('paginator1') paginator1!: MatPaginator;
  @ViewChild('paginator2') paginator2!: MatPaginator;

  newHSNCodeForm: FormGroup;
  elementData: any;
  codeDetails: any

  constructor(
    private dialogRef: MatDialogRef<AddHSNCodeMasterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private hsnCodeMasterService: HSNCodeMasterService,
    private _datePipe: DatePipe,
  ) {
    console.log(data, "Semo")

    this.elementData = data.element;
    this.newHSNCodeForm = this.fb.group({
      Code: ['0'],
      HSNCode: ['', Validators.required],
      ProductionDescription: ['', Validators.required],
      tableRows1: this.fb.array([]),
      tableRows2: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.addRow('tableRows1');
    this.addRow('tableRows2');
    this.edit()
  }

  edit() {
    this.newHSNCodeForm.patchValue({
      // Code: this.elementData?.HSNCodeMaster[0].Code,
      HSNCode: this.elementData?.HSNCodeMaster[0].HSNCode,
      ProductionDescription: this.elementData.HSNCodeMaster[0].ProductDesp
    });
    this.populateRows('tableRows1', this.elementData?.HSNCodeExportRateBenefitDetail);
    this.populateRows('tableRows2', this.elementData?.HSNCodeDetails);
  }

  populateRows(formArrayName: string, data: any[]) {

    const formArray = this.newHSNCodeForm.get(formArrayName) as FormArray;
    data?.forEach(item => {
      const applicableDate = this._datePipe.transform(item.ApplicableDate, 'yyyy-MM-dd');
      formArray.push(this.fb.group({
        ApplicableDate: applicableDate,
        MEISRate: item.MEISRate,
        DBKRate: item.DBKRate,
        Rate: item.Rates,
        SpecialRate: item.SpecialRate,
        CessRate: item.Rates2
      }));
    });
  }

  get tableRows1(): FormArray {
    return this.newHSNCodeForm.get('tableRows1') as FormArray;
  }

  get tableRows2(): FormArray {
    return this.newHSNCodeForm.get('tableRows2') as FormArray;
  }

  addRow(formArrayName: string) {
    const formArray = this.newHSNCodeForm.get(formArrayName) as FormArray;
    if (formArrayName === 'tableRows1') {
      formArray.push(this.fb.group({
        ApplicableDate: ['', Validators.required],
        MEISRate: ['', Validators.required],
        DBKRate: ['', Validators.required]
      }));
    } else {
      formArray.push(this.fb.group({
        ApplicableDate: ['', Validators.required],
        Rate: ['', Validators.required],
        SpecialRate: ['', Validators.required],
        CessRate: ['', Validators.required]
      }));
    }
  }

  focusNext(event: KeyboardEvent, nextControlName: string, index: number, formArrayName: string) {
    const keyboardEvent = event as KeyboardEvent;
    if (keyboardEvent.key === 'Enter') {
      keyboardEvent.preventDefault();
      if (nextControlName === 'addRow') {
        this.addRow(formArrayName);
      } else {
        const nextInput = document.querySelector(`[formArrayName="${formArrayName}"] [formGroupName="${index}"] [formControlName="${nextControlName}"]`) as HTMLElement;
        nextInput?.focus();
      }
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

  saveHSNCode() {
    debugger
    if (this.newHSNCodeForm.valid) {
      const formData = { ...this.newHSNCodeForm.value };

      // Perform any necessary transformations before sending the data
      const Obj = {
        hsnCodeMaster: [{
          code: formData.Code === '' ? '0' : formData.Code,
          hsnCode: formData.HSNCode,
          productDesp: formData.ProductionDescription,
          userMaster_Code: 2
        }],
        hsnCodeDetails: formData.tableRows2.map((row: any) => ({
          code: formData.Code === '' ? '0' : formData.Code,
          hsnCodeMaster_Code: 0,
          applicableDate: row.ApplicableDate,
          rates: row.Rate,
          specialRate: row.SpecialRate,
          rates2: row.CessRate
        })),
        hsnCodeExportRateBenefitDetail: formData.tableRows1.map((row: any) => ({
          code: formData.Code === '' ? '0' : formData.Code,
          hsnCodeMaster_Code: 0,
          applicableDate: row.ApplicableDate,
          meisRate: row.MEISRate,
          dbkRate: row.DBKRate
        }))
      };
      console.log(Obj);

      this.hsnCodeMasterService.saveHSNCode(JSON.stringify(Obj)).subscribe({
        next: (res: any) => {
          alert(res.Msg);
          console.log(res);
        },
        error: (err: any) => {
          console.error('Error saving HSN Code:', err);
          alert('Failed to save HSN Code.');
        }
      });
    }
  }
  // populateHSNCodeMaster(HSNCodeMaster: any) {
  //   this.newHSNCodeForm.patchValue({
  //     Code: HSNCodeMaster.Code,
  //     HSNCode: HSNCodeMaster.HSNCode,
  //     ProductionDescription: HSNCodeMaster.ProductDesp,
  //   })
  // }
  // HSNCodeDetailspopulateTableRows(Data: any[]) {
  //   Data.forEach(row => {
  //     this.tableRows2.push(this.fb.group({
  //       ApplicableDate: [row.ApplicableDate, Validators.required],
  //       Rate: [row.Rates, Validators.required],
  //       SpecialRate: [row.SpecialRate, Validators.required],
  //       CessRate: [row.Rates2, Validators.required]
  //     }));
  //   });
  // }
  // HSNCodeExportRateBenefitDetailpopulateRows(Data: any[]) {
  //   Data.forEach(row => {
  //     this.tableRows1.push(this.fb.group({
  //       ApplicableDate: [row.ApplicableDate, Validators.required],
  //       MEISRate: [row.MEISRate, Validators.required],
  //       DBKRate: [row.DBKRate, Validators.required]
  //     }));
  //   });
  // }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
