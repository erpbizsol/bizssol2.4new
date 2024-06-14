import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { ChemicalService } from 'src/app/services/Master/chemical.service';
import { SnackBarService } from 'src/app/services/SnakBar-Service/snack-bar.service';

@Component({
  selector: 'app-chemical-dialog',
  standalone: true,
  providers: [ChemicalService],
  imports: [CommonModule, MatRadioModule, MatCheckboxModule, MatIconModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './chemical-dialog.component.html',
  styleUrl: './chemical-dialog.component.scss'
})
export class ChemicalDialogComponent {
  elementData: any;
  submitted: boolean = false
  chemicalForm !: FormGroup;
  // chemicallist: any = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _chemicalService: ChemicalService,
    private snackBarService: SnackBarService,
    public dialogRef: MatDialogRef<ChemicalDialogComponent>,
    private fb: FormBuilder) {
    this.elementData = data.element
  }
  ngOnInit(): void {
    this.setForm();
    // this.patchChemicalData();
  }



  setForm() {
    this.chemicalForm = this.fb.group({
      chemical: ['', [Validators.required,]],
      sortorder: ['', [Validators.required,]],
      inspection: ['', [Validators.required,]],

    })
  }

  // getChemicalList() {
  //   this._chemicalService.getChemicalList().subscribe(res => {
  //     this.chemicallist = res;
  //     console.log(this.chemicallist);

  //   })
  // }
  saveChemical() {
    this.submitted = true;

    let data = [{
      code: this.elementData.Code ? this.elementData.Code : 0,
      chemicalName: this.chemicalForm.value.chemical,
      sortorder: this.chemicalForm.value.sortorder,
      inspectionmethod: this.chemicalForm.value.inspectionmethod,
      userMaster_Code: 0,
    }]
    if (this.elementData.Code === undefined || 0) {
      this._chemicalService.saveChemical(data).subscribe({
        next:((res:any)=>{
          this.chemicalForm.reset()
          this.dialogRef.close();
          this.snackBarService.showSuccessMessage(res.Msg);
        }),
        error:(err:any)=>{
          console.log(err.error.message);
          this.snackBarService.showErrorMessage(err?.error?.Msg);
        }
      })

    }
    else{
      this._chemicalService.saveChemical(data).subscribe({
        next:((res:any)=>{
          this.chemicalForm.reset()
          this.dialogRef.close();
          this.snackBarService.showSuccessMessage(res.Msg);
        }),
        error:(err:any)=>{
          console.log(err.error.message);
          this.snackBarService.showErrorMessage(err?.error?.Msg);
        }
      })
    }
  }
  patchChemicalData(){
    this.chemicalForm.patchValue({
      
    })
  }
}
