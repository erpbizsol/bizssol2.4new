import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { CategoryService } from '../../../../services/Master/category.service'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SnackBarService } from 'src/app/services/SnakBar-Service/snack-bar.service';

@Component({
  selector: 'app-category-dialog',
  standalone: true,
  providers: [CategoryService],
  imports: [CommonModule, MatRadioModule, MatCheckboxModule, MatIconModule, ReactiveFormsModule, HttpClientModule, FormsModule],
  templateUrl: './category-dialog.component.html',
  styleUrl: './category-dialog.component.scss'
})
export class CategoryDialogComponent {

  elementData: any;
  categoryForm !: FormGroup;
  selectedOption:string;
  submitted: boolean = false
  isMechanical: boolean;
  name: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _categoryService: CategoryService,
    private snackBarService: SnackBarService,
    public dialogRef: MatDialogRef<CategoryDialogComponent>,
    private fb: FormBuilder) {
    this.elementData = data.element
    this.setForm()
  }


  setForm() {
    this.categoryForm = this.fb.group({
      category: ['', [Validators.required,]],
      categorydescription: ['', [Validators.required,]],
      componentcost: ['', [Validators.required,]],
    })
  }

  savecategorydata() {
    this.submitted = true;

    // if(this.categoryForm.invalid){
    //   this.snackBarService.showErrorMessage("Please Fill All the Field");
    //   return;
    // }
   
    console.log(this.selectedOption);
    let data = [{
      code: this.elementData.code ? this.elementData.code : 0,
      categoryName: this.categoryForm.value.category,
      categoryDesc: this.categoryForm.value.categorydescription,
      componentCostPercentage: this.categoryForm.value.componentcost,
      FormType: this.selectedOption,
      StockApplicable: 'N',
      RejectedItem: 'N'
    }]
    if (this.elementData.code === undefined || 0) {
      this._categoryService.saveCategory(data).subscribe({
        next: ((res: any) => {
          this.categoryForm.reset()
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
      this._categoryService.saveCategory(data).subscribe({
        next: ((res: any) => {
          this.categoryForm.reset()
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
    return this.categoryForm.controls
  }

}
