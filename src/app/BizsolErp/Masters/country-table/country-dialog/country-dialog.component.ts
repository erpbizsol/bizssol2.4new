import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { CountryService } from '../../../../services/Master/country.service'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SnackBarService } from 'src/app/services/SnakBar-Service/snack-bar.service';

@Component({
  selector: 'app-country-dialog',
  standalone: true,
  providers: [CountryService],
  imports: [CommonModule, MatRadioModule, MatCheckboxModule, MatIconModule, ReactiveFormsModule, HttpClientModule, FormsModule,HttpClientModule],
  templateUrl: './country-dialog.component.html',
  styleUrl: './country-dialog.component.scss'
})
export class CountryDialogComponent {

  elementData: any;
  countryForm !: FormGroup;
  // selectedOption:string;
  submitted: boolean = false;
  name: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _countryService: CountryService,
    private snackBarService: SnackBarService,
    public dialogRef: MatDialogRef<CountryDialogComponent>,
    private fb: FormBuilder) {
    this.elementData = data.element
    this.setForm()
  }
  ngOnInit() {
    this.patchCountryData()
    
  }


  setForm() {
    this.countryForm = this.fb.group({
      country: ['', [Validators.required]],
      countrycode: ['', [Validators.required]],
    })
  }

  savecountrydata() {
    this.submitted = true;

    
    let data = {
      Code: this.elementData.Code ? this.elementData.Code : 0,
      CountryName: this.countryForm.value.country,
      CountryCode: this.countryForm.value.countrycode,      
    }
    if (this.elementData.Code === undefined || 0) {
      this._countryService.saveCountry(data).subscribe({
        next: ((res: any) => {
          this.countryForm.reset()
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
      this._countryService.saveCountry(data).subscribe({
        next: ((res: any) => {
          this.countryForm.reset()
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

  patchCountryData() {
    this.countryForm.patchValue({
      country: this.elementData?.CountryName,
      countrycode: this.elementData?.CountryCode,
     
    });
    
  }



  // ////////////////////////////////////////////////////////////////Validations///////////////////////////////////////////////////////
  // we can ,only write alphabet in country field
  allowAlphabetsOnly(event: KeyboardEvent): void {
    const charCode = event.which ? event.which : event.keyCode;
    const charStr = String.fromCharCode(charCode);

    if (!/^[a-zA-Z\s]*$/.test(charStr)) {
      event.preventDefault();
    }
  }

  allowNumberOnly(event: KeyboardEvent): void {
    const charCode = event.which ? event.which : event.keyCode;
    const charStr = String.fromCharCode(charCode);

    // Allow numbers and plus sign only
    if (!/^[0-9+]*$/.test(charStr)) {
      event.preventDefault();
    }
  }


  onNoClick(): void {
    this.dialogRef.close();
  }

  get f() {
    return this.countryForm.controls
  }

}
