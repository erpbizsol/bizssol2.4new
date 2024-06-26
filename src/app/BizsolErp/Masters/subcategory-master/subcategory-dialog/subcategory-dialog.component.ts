import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { SubcategoryService } from 'src/app/services/Master/subcategory.service';
import { SnackBarService } from 'src/app/services/SnakBar-Service/snack-bar.service';

@Component({
  selector: 'app-subcategory-dialog',
  standalone: true,
  imports: [CommonModule, MatRadioModule, MatCheckboxModule, MatIconModule, ReactiveFormsModule, HttpClientModule, FormsModule],
  templateUrl: './subcategory-dialog.component.html',
  styleUrl: './subcategory-dialog.component.scss'
})
export class SubcategoryDialogComponent {

  
  elementData: any;
  subcategoryForm !: FormGroup;
  submitted: boolean = false
  name: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _subcategoryService: SubcategoryService,
    private snackBarService: SnackBarService,
    public dialogRef: MatDialogRef<SubcategoryDialogComponent>,
    private fb: FormBuilder) {
    this.elementData = data.element
    this.setForm()
  }


  setForm() {
    this.subcategoryForm = this.fb.group({
      category: "",
      subcategoryname: ['', [Validators.required,]],
      itemcode: ['', [Validators.required,]],
      subgroupcode:['',[Validators.required]],
      formtype:"",
      LogoApplicable:"Y",
      SizeApplicable:"N",
      ItemCodeApplicable:"N",
      LotNoApplicable:"N",
      MaterialApplicable:"N",
      IsPackingMaterial:['',[Validators.required]],
      

    })
  }

  savecategorydata() {
    this.submitted = true;

    // if(this.categoryForm.invalid){
    //   this.snackBarService.showErrorMessage("Please Fill All the Field");
    //   return;
    // }
   
    let data = [{
      code: this.elementData.code ? this.elementData.code : 0,
      categoryName: this.subcategoryForm.value.category,
      categoryDesc: this.subcategoryForm.value.categorydescription,
      componentCostPercentage: this.subcategoryForm.value.componentcost,
      // FormType: this.selectedOption,
      StockApplicable: 'N',
      RejectedItem: 'N'
    }]
    if (this.elementData.code === undefined || 0) {
      this._subcategoryService.saveSubCategory(data).subscribe({
        next: ((res: any) => {
          this.subcategoryForm.reset()
          this.dialogRef.close();
          this.snackBarService.showSuccessMessage(res.Msg);
        }),
        error: (err: any) => {
          console.log(err.error.message);
          this.snackBarService.showErrorMessage(err?.error?.Msg);
        }
      })

    }
    else {
      this._subcategoryService.saveSubCategory(data).subscribe({
        next: ((res: any) => {
          this.subcategoryForm.reset()
          this.dialogRef.close();
          this.snackBarService.showSuccessMessage(res.Msg);
        }),
        error: (err: any) => {
          console.log(err.error.message);
          this.snackBarService.showErrorMessage(err?.error?.Msg);
        }
      })
    }
  }


  onNoClick(): void {
    this.dialogRef.close();
  }

  get f() {
    return this.subcategoryForm.controls
  }

}
