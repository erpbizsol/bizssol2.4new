import { CommonModule, Location } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FollowUpService } from 'src/app/services/Transaction/follow-up.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from 'src/app/services/toaster-message/toaster.service';

@Component({
  selector: 'app-new-follow-up',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, HttpClientModule, CommonModule],
  templateUrl: './new-follow-up.component.html',
  styleUrls: ['./new-follow-up.component.scss'],
  providers: [FollowUpService, ToasterService],
  encapsulation: ViewEncapsulation.None
})
export class NewFollowUpComponent {
  isDataAvailable: boolean = false;
  @ViewChild('ourRemarksInput') ourRemarksInput: any;

  newFollowUpForm: FormGroup;
  minDate: string;

  code: any;
  EnquiryMaster_Code: any;
  options: any = [];
  pastSelectedModeAndContactPersonName: any;

  constructor(private followUpService: FollowUpService, private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private location: Location, private toasterService: ToasterService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.EnquiryMaster_Code = params['EnquiryMaster_Code'];
      this.isDataAvailable = params['isDataAvailable'] === 'true';
      this.pastSelectedModeAndContactPersonName = JSON.parse(params['lastcreatedData'] || '{}'); // Parsing JSON data if available      
    });

    this.setMinDate();
    this.followupData();
    this.fetchOptionsFromAPI();
  }

  setMinDate() {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

  followupData() {
    const today = new Date().toISOString().split('T')[0];

    // Set default values or values from pastSelectedModeAndContactPersonName
    const defaultFollowupMode = this.pastSelectedModeAndContactPersonName?.NextFollowupMode || 'call';
    const defaultCustomerContactPersonName = this.pastSelectedModeAndContactPersonName?.CustomerContactPersonName || '';

    this.newFollowUpForm = this.fb.group({
      followupDate: [today, Validators.required],
      FollowupMode: [defaultFollowupMode, Validators.required],
      showNextFollowup: [true],
      nextFollowupMode: ['call', Validators.required],
      nextFollowupDate: ['', Validators.required],
      ourRemarks: ['', [Validators.required, Validators.maxLength(299)]],
      customerRemarks: ['', [Validators.required, Validators.maxLength(299)]],
      CustomerContactPersonName: [defaultCustomerContactPersonName, Validators.required]
    });

    this.newFollowUpForm.get('showNextFollowup').valueChanges.subscribe(show => {
      const nextFollowupMode = this.newFollowUpForm.get('nextFollowupMode');
      const nextFollowupDate = this.newFollowUpForm.get('nextFollowupDate');
      if (show) {
        nextFollowupMode.setValidators([Validators.required]);
        nextFollowupDate.setValidators([Validators.required]);
      } else {
        nextFollowupMode.clearValidators();
        nextFollowupDate.clearValidators();
        nextFollowupDate.reset();
      }
      nextFollowupMode.updateValueAndValidity();
      nextFollowupDate.updateValueAndValidity();
    });
  }

  onSubmit() {
    if (this.newFollowUpForm.valid) {
      const enquiryMasterCode = this.EnquiryMaster_Code;

      let formData: any = {
        ...this.newFollowUpForm.value,
        EnquiryMaster_Code: enquiryMasterCode
      };

      if (!this.newFollowUpForm.get('showNextFollowup').value) {
        delete formData.nextFollowupMode;
        delete formData.nextFollowupDate;
      }

      this.followUpService.createFollowup(formData).subscribe(
        res => {
          this.newFollowUpForm.reset();
          this.location.back();
          this.toasterService.showSuccess('Follow-Up created successfully!');
        },
        error => {
          this.toasterService.showError('Failed to save Follow Up');
        }
      );

    } else {
      this.newFollowUpForm.markAllAsTouched();
    }
  }

  Cancel() {
    if (this.isDataAvailable) {
      // Navigate to LeadComponent if data is not available
      this.router.navigate(['/leads/table']);
    } else {
      // Navigate back if data is available
      this.location.back();
    }
  }

  fetchOptionsFromAPI() {
    this.followUpService.getCustomerContactPersionName(this.EnquiryMaster_Code).subscribe(
      (data: any) => {
        this.options = data;
        if (this.options.length > 0 && !this.pastSelectedModeAndContactPersonName.CustomerContactPersonName) {
          this.newFollowUpForm.patchValue({
            CustomerContactPersonName: this.options[0].ContactPersonName
          });
        }
      },
    );
  }
}
