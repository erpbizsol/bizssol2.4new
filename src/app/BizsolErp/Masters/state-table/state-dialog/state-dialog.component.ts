import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { CountryService } from '../../../../services/Master/country.service'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToasterService } from 'src/app/services/toaster-message/toaster.service';
import { StateService } from 'src/app/services/Master/state.service';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-country-dialog',
  standalone: true,
  providers: [CountryService,StateService],
  imports: [CommonModule, MatRadioModule, MatCheckboxModule, MatIconModule, ReactiveFormsModule, HttpClientModule, FormsModule,HttpClientModule,MatTableModule,MatSelectModule],
  templateUrl: './state-dialog.component.html',
  styleUrl: './state-dialog.component.scss'
})
export class StateDialogComponent {

  elementData: any;
  stateForm !: FormGroup;
  // selectedOption:string;
  countrylist:any= [];
  submitted: boolean = false;
  name: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    // private _countryService: CountryService,
    private _countryService:CountryService,
    private _stateService:StateService,
    private toaster: ToasterService,
    public dialogRef: MatDialogRef<StateDialogComponent>,
    private fb: FormBuilder) {
    this.elementData = data.element
    this.setForm()
  }
  ngOnInit() {
    this.getCountryList();
    this.patchCountryData()
    
  }


  setForm() {
    this.stateForm = this.fb.group({
      country: ['', [Validators.required]],
      stateName: ['', [Validators.required]],
      stateInitial: ['', [Validators.required]],
      stateCode: ['', [Validators.required]],
    })
  }

  getCountryList() {
    this._countryService.getCountry().subscribe(res => {
      this.countrylist = res;

    })
  }


  savecountrydata() {
    this.submitted = true;

    
    let data = {
      Code: this.elementData.Code ? this.elementData.Code : 0,
      CountryName: this.stateForm.value.country,
      StateName: this.stateForm.value.stateName,      
      StateShortName: this.stateForm.value.stateInitial,      
      StateCode: this.stateForm.value.stateCode,      
    }
    if (this.elementData.Code === undefined || 0) {
      this._stateService.saveState(data).subscribe({
        next: ((res: any) => {
          this.stateForm.reset()
          this.dialogRef.close();
          this.toaster.showSuccess(res.Msg);
        }),
        error: (err: any) => {
          console.log(err.error.message);
          // this.snackBarService.showErrorMessage(err?.error?.Msg);
          this.toaster.showError(err?.error?.Msg);
        }
      })

    }
    else {
      this._stateService.saveState(data).subscribe({
        next: ((res: any) => {
          this.stateForm.reset()
          this.dialogRef.close();
          // this.toaster.showSuccess(res.Msg)

          this.toaster.showSuccess(res.Msg);
        }),
        error: (err: any) => {
          console.log(err.error.message);
          this.toaster.showError(err?.error?.Msg);
        }
      })
    }
  }

  patchCountryData() {
    this.stateForm.patchValue({
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
    return this.stateForm.controls
  }

}
