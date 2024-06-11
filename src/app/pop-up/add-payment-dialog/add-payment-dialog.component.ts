
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PaymetntTermService } from 'src/app/services/Master/paymetnt-term.service';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SnackBarService } from 'src/app/services/SnakBar-Service/snack-bar.service';
import { MatIconModule } from '@angular/material/icon';





@Component({
  selector: 'app-add-payment-dialog',
  standalone: true,

  imports: [CommonModule, MatRadioModule, MatCheckboxModule, MatIconModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './add-payment-dialog.component.html',
  styleUrl: './add-payment-dialog.component.scss',
  providers: [PaymetntTermService,]

})
export class AddPaymentDialogComponent {
  elementData: any
  submitted: boolean = false
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private payment: PaymetntTermService,
    private snackBarService: SnackBarService,
    public dialogRef: MatDialogRef<AddPaymentDialogComponent>) {
    this.elementData = data.element
  }

  ngOnInit() {
    this.patchPaymentData()
    this.paymentTermsForm.get('advancePayment').valueChanges.subscribe(value => {
      this.onAdvancePaymentChange(value);
    });

  }
  paymentTermsForm = new FormGroup({
    description: new FormControl('', Validators.required),
    advancePayment: new FormControl(false),
    status: new FormControl('',Validators.required),
    advancePaymentPercentage: new FormControl(''),

    // advancePaymentPercentage: new FormControl({ value: '', disabled: true }, Validators.required)
  })


  onAdvancePaymentChange(isAdvancePayment: boolean) {
    console.log(isAdvancePayment,"kkkk")
    const advancePaymentPercentageControl = this.paymentTermsForm.get('advancePaymentPercentage');
    if (isAdvancePayment) {
      advancePaymentPercentageControl.setValidators(Validators.required);
      advancePaymentPercentageControl.enable();
    } else {
      advancePaymentPercentageControl.clearValidators();
      advancePaymentPercentageControl.disable();
    }
    advancePaymentPercentageControl.updateValueAndValidity();
  }
  savePaymentTerms() {
    debugger
    this.submitted = true
    if (this.paymentTermsForm.invalid) {
      this.snackBarService.showErrorMessage("Please Fill All the Field");
      return

    }
    if( Number(this.paymentTermsForm.value.advancePaymentPercentage) === 0){
      this.snackBarService.showErrorMessage("Advance Payment Amount  should be greater then 0 ")
      this.submitted = false

      return

    }
    let data = [{
      code: this.elementData.Code ? this.elementData.Code : 0,
      desp: this.paymentTermsForm.value.description,
      databaseLocation_Code: 0,
      advPaymentApplicable: this.paymentTermsForm.value.advancePayment == true ? 'Y' : 'N',
      advancePayment: this.paymentTermsForm.value.advancePaymentPercentage !== '' ? this.paymentTermsForm.value.advancePaymentPercentage : 0,
      defaultForOrder: this.paymentTermsForm.value.status,
      isActive: this.paymentTermsForm.value.status !== undefined ? this.paymentTermsForm.value.status : 'N',
      userMaster_Code: 2
    }]


    if (this.elementData.Code === undefined || 0) {
      this.payment.savePayment(data).subscribe({
        next: ((res: any) => {
          this.paymentTermsForm.reset()
          this.dialogRef.close();
          this.snackBarService.showSuccessMessage(res.Msg);
        }),
        error: (err: any) => {
          console.log(err.error.message)
          this.snackBarService.showErrorMessage(err?.error?.Msg);
        }
      })

    } else {
      this.payment.savePayment(data).subscribe({
        next: ((res: any) => {
          this.paymentTermsForm.reset()
          this.dialogRef.close();
          this.snackBarService.showSuccessMessage(res.Msg);
        }),
        error: (err: any) => {
          console.log(err.error.message)
          this.snackBarService.showErrorMessage(err?.error?.Msg);
        }
      })
    }
  }

  // patchPaymentData() {
  //   this.paymentTermsForm.patchValue({
  //     description: this.elementData?.Desp,
  //     advancePaymentPercentage: this.elementData?.AdvancePayment,
  //     status: this.elementData.IsActive,
  //     advancePayment: this.elementData?.AdvPaymentApplicable === 'Y'

  //   })
  // }

  patchPaymentData() {
    this.paymentTermsForm.patchValue({
      description: this.elementData?.Desp,
      advancePaymentPercentage: this.elementData?.AdvancePayment,
      status: this.elementData.IsActive,
      advancePayment: this.elementData?.AdvPaymentApplicable === 'Y'
    });
    this.onAdvancePaymentChange(this.elementData?.AdvPaymentApplicable === 'Y');
  }


  allowAlphabetsOnly(event: KeyboardEvent): void {
    const charCode = event.which ? event.which : event.keyCode;
    const charStr = String.fromCharCode(charCode);

    if (!/^[a-zA-Z]*$/.test(charStr)) {
      event.preventDefault();
    }
  }


  allowNumberOnly(event: KeyboardEvent): void {
    const charCode = event.which ? event.which : event.keyCode;
    const charStr = String.fromCharCode(charCode);

    if (!/^[0-9]*$/.test(charStr)) {
      event.preventDefault();
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  get f() {
    return this.paymentTermsForm.controls
  }

}
