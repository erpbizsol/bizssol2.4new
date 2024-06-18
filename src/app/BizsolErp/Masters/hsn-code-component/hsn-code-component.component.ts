import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import {Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { HSNCodeMasterService} from 'src/app/services/Master/hsn-code-master.service'
import { FormBuilder, ReactiveFormsModule, FormGroup, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'app-hsn-code-component',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, CommonModule],
  templateUrl: './hsn-code-component.component.html',
  styleUrl: './hsn-code-component.component.scss',
  providers:[HSNCodeMasterService]
})
export class HSNCodeMasterComponent implements OnInit {
  @ViewChildren('levelInput') levelInputs!: QueryList<ElementRef>;

  newHSNCodeForm: FormGroup;

  constructor(private hsnCodeService: HSNCodeMasterService,private fb: FormBuilder) {}

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
    setTimeout(() => {
      this.focusNewRow();
    });
  }

  createTableRow2(): FormGroup {
    return this.fb.group({
      ApplicableDate: ['', Validators.required],
      Rate: ['', Validators.required],
      SpecialRate: ['', Validators.required],
      CessRate: ['', Validators.required]
    });
    // Focus the new row's first input element
    setTimeout(() => {
      this.focusNewRow();
    });
  }

  focusNewRow() {
    const inputArray = this.levelInputs.toArray();
    const newRowInput = inputArray[inputArray.length - 1].nativeElement;
    newRowInput.focus();
  }

  saveHSNCode(): void {
    if (this.newHSNCodeForm.valid) {
      console.log(this.newHSNCodeForm.value);
      // Call the service to save the form data
      this.hsnCodeService.saveHSNCode(this.newHSNCodeForm.value).subscribe(response => {
        console.log('HSN Code saved successfully', response);
      }, error => {
        console.error('Error saving HSN Code', error);
      });
    }
  }
}
