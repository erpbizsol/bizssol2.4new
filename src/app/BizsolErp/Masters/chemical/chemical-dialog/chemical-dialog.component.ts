import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { ChemicalService } from '../../../../services/Master/chemical.service';
import { SnackBarService } from '../../../../services/SnakBar-Service/snack-bar.service';

@Component({
  selector: 'app-chemical-dialog',
  standalone: true,
  providers: [ChemicalService],
  imports: [CommonModule, MatRadioModule, MatCheckboxModule, MatIconModule, ReactiveFormsModule, HttpClientModule,FormsModule],
  templateUrl: './chemical-dialog.component.html',
  styleUrl: './chemical-dialog.component.scss'
})
export class ChemicalDialogComponent {
  elementData: any;
  submitted: boolean = false
  isMechanical:boolean;
  chemicalForm !: FormGroup;
  name: any;
  // chemicallist: any = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _chemicalService: ChemicalService,
    private snackBarService: SnackBarService,
    public dialogRef: MatDialogRef<ChemicalDialogComponent>,
    private fb: FormBuilder) {
    this.elementData = data.element
  }

  toggleDiv(value:string) {
    if (value === 'Y') {
      this.isMechanical = false;
      this.chemicalForm.reset();
    } else if (value === 'N') {
      this.isMechanical = true;
      this.chemicalForm.reset();
    }
  }
  ngOnInit(): void {
    this.setForm();
    // this.chemicalForm.get('').valueChanges.subscribe(value=>{

    // });
  }
  
  setForm() {
    this.chemicalForm = this.fb.group({
      chemical: ['', [Validators.required,]],
      sortorder: ['', [Validators.required,]],
      status: ['Y'] ,
      inspection: ['', [Validators.required,]],

    })
  }
  savechemicaldata() {
    this.submitted = true;

    if(this.chemicalForm.invalid){
      this.snackBarService.showErrorMessage("Please Fill All the Field");
      return
    }
    

    let data = [{
      Code: this.elementData.Code ? this.elementData.Code : 0,
      ChemicalName: this.chemicalForm.value.chemical,
      SortOrder: this.chemicalForm.value.sortorder,
      InspectionMethod: this.chemicalForm.value.inspectionmethod,
      isChemicalProperty:this.chemicalForm.value.status,
      UserMaster_Code: 0,
    }]
    if (this.elementData.Code === undefined || 0) {
      this._chemicalService.saveChemicaldata(data).subscribe({
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
      this._chemicalService.saveChemicaldata(data).subscribe({
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
      chemical:this.elementData?.ChemicalName,
      sortorder:this.elementData?.SortOrder,
      status:this.elementData?.isChemicalProperty,
      inspection:this.elementData.InspectionMethod
    })

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  get f() {
    return this.chemicalForm.controls
  }

/////////////////////////////////////////////////////////////Validation for the fields/////////////////////////////////////////////
Charactervalidation(event:KeyboardEvent){
  const inputChar = String.fromCharCode(event.charCode);
  const pattern = /[a-zA-Z% ]/;
  if (!pattern.test(inputChar)) {
    // If the input character is not an alphabet, prevent it from being entered into the input field
    event.preventDefault();
  }
}

orderValidation(event:KeyboardEvent){
  const inputChar =String.fromCharCode(event.charCode);
  const pattern=/[0-9. ]/;
  if(!pattern.test(inputChar)){
    event.preventDefault();
  }
}



}
