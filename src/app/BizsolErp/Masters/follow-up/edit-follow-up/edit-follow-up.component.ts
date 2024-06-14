import { CommonModule, DatePipe, Location } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { FollowUpService } from '../../../../services/Transaction/follow-up.service';
import { SnackBarService } from 'src/app/services/SnakBar-Service/snack-bar.service';

@Component({
  selector: 'app-edit-follow-up',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, HttpClientModule, CommonModule],
  providers: [FollowUpService, DatePipe, SnackBarService],
  templateUrl: './edit-follow-up.component.html',
  styleUrl: './edit-follow-up.component.scss'
})
export class EditFollowUpComponent {
  newFollowUpForm: FormGroup;
  @ViewChild('ourRemarksInput') ourRemarksInput: any;

  code: number;
  selectedRowData: any;
  options: any = [];
  minDate: string;

  constructor(
    private followUpService: FollowUpService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private location: Location,
    private snackBarService: SnackBarService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.code = params['code'];
    });
    this.setMinDate(); 
    this.initForm();
    this.getfollowUpDataByCode();
  }

  setMinDate() {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

  initForm(): void {
    this.newFollowUpForm = this.fb.group({
      OurRemarks: ['', [Validators.required, Validators.maxLength(300)]],
      CustomerRemarks: ['', [Validators.required, Validators.maxLength(300)]],
      FollowupDate: ['', Validators.required],
      showNextFollowup: [true],
      NextFollowupDate: ['', Validators.required],
      CustomerContactPersonName: [''],
      FollowupMode: ['', Validators.required],
      NextFollowupMode: ['', Validators.required],
    });
  }

  getfollowUpDataByCode(): void {
    this.followUpService.followupDetailsByCode(this.code).subscribe((responseOfRowData: any) => {
      this.selectedRowData = responseOfRowData;
      this.populateForm();
      this.fetchOptionsFromAPI();
    });
  }

  populateForm(): void {
    const NextFollowupDate = this.datePipe.transform(this.selectedRowData.NextFollowupDate, 'yyyy-MM-dd');
    const FollowupDate = this.datePipe.transform(this.selectedRowData.FollowupDate, 'yyyy-MM-dd');

    this.newFollowUpForm.patchValue({
      OurRemarks: this.selectedRowData.OurRemarks,
      CustomerRemarks: this.selectedRowData.CustomerRemarks,
      FollowupDate: FollowupDate,
      NextFollowupDate: NextFollowupDate,
      CustomerContactPersonName: this.selectedRowData.CustomerContactPersonName,
      FollowupMode: this.selectedRowData.FollowupMode,
      NextFollowupMode: this.selectedRowData.NextFollowupMode,
      EnquiryMaster_Code: this.selectedRowData.EnquiryMaster_Code,
    });
  }

  onUpdate(): void {
    if (this.newFollowUpForm.valid) {
      const formData = this.newFollowUpForm.value;
      formData.code = this.code;
      formData.EnquiryMaster_Code = this.selectedRowData.EnquiryMaster_Code;
  
      if (!this.newFollowUpForm.get('showNextFollowup').value) {
        delete formData.NextFollowupMode;
        delete formData.NextFollowupDate;
      }
  
      this.followUpService.createFollowup(formData).subscribe(
        res => {
          this.snackBarService.showSuccessMessage('Follow Up updated successfully!');
          this.location.back();
        },
        err => {
          this.snackBarService.showErrorMessage('Failed to update Follow Up');
        }
      );
    } else {
      this.newFollowUpForm.markAllAsTouched();
    }
  }
  

  fetchOptionsFromAPI() {
    this.followUpService.getCustomerContactPersionName(this.selectedRowData.EnquiryMaster_Code).subscribe(
      (data: any) => {
        this.options = data;
      },
    );
  }

  Cancel() {
    this.location.back();
  }
}
