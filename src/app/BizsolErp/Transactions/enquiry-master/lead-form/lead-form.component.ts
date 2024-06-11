import { Component, OnInit, ViewChild, ChangeDetectorRef, OnChanges, SimpleChanges, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EnquiryService } from 'src/app/services/Master/enquiry.service';
import { ContactPersonService } from 'src/app/services/Master/contact-person.service';
import { StateService } from 'src/app/services/Master/state.service';
import { CityService } from 'src/app/services/Master/city.service';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { AsyncPipe, CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { UrlService } from '../../../../services/URL/url.service';
import { Observable } from 'rxjs';
import { RouterModule } from '@angular/router';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfermationPopUpComponent } from 'src/app/pop-up/delete-confermation/delete-confermation-pop-up/delete-confermation-pop-up.component';
import { ProductDetailsService } from 'src/app/services/Master/product-details.service';

@Component({
  selector: 'app-lead-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, FormsModule, AsyncPipe,
    HttpClientModule, MatFormFieldModule, MatListModule, MatSelectModule, CommonModule, MatInputModule, MatAutocompleteModule, DeleteConfermationPopUpComponent],
  providers: [EnquiryService, StateService, CityService, ContactPersonService, ProductDetailsService],
  templateUrl: './lead-form.component.html',
  styleUrl: './lead-form.component.scss'
})
export class LeadFormComponent implements OnInit {
  minDate: string;
  maxDate: string
  enquiryFormSubmitted: boolean = false;
  contactPersonTab: boolean = false;
  productDetailsTab: boolean = false;

  newCode: number;
  leadCode: any;
  leadData: any = [];
  contactPersonsList: any = [];
  enquiryProductDetails: any = [];
  followupDetail: any = [];

  companyList: any = [];
  newCustomerForm: FormGroup;
  contactPerson: FormGroup;
  productDetails: FormGroup;
  countryList: any[] = [];
  stateList: any[] = [];
  cityList: any[] = [];
  leadSourceList: any[] = [];
  salePersonList: any = [];
  departments: any = [];
  designation: any = [];
  UOM: any = [];
  industryType: any = [];
  productList: any[] = [];
  Specification: any = [];
  getPincode: any = [];

  private headers = new HttpHeaders({
    'Content-Type': 'application/json; charset=utf-8',
    // 'Authorization': this.authservice.getAccessTokenNew()
  });
  constructor(private fb: FormBuilder, private _enquiryService: EnquiryService, private _state: StateService, private _city: CityService,
    private _http: HttpClient, private _urlService: UrlService, private _changeDetect: ChangeDetectorRef, private elementRef: ElementRef,
    private _contactPersonService: ContactPersonService, private productDetailsService: ProductDetailsService, private route: ActivatedRoute, private location: Location, private dialog: MatDialog
  ) {

    this.enquiryForm(),

      this.getDepartment(),
      this.getDesignation(),
      this.getLeadSource(),
      this.getSalesPerson(),
      this.UOMList(),
      this.getIndustryType(),
      this.getProduct(),
      this.productSpecification(),
      this._http.get(this._urlService.API_ENDPOINT_COUNTRY + '/GetCountryMasterList').subscribe((res: any) => {
        this.countryList = res;
      })
  }

  myControl: FormControl = new FormControl('');
  options = ['aoption1', 'aaoption2', 'aboption3', 'aacoption4', 'option5', 'option6', 'option7', 'option8'];
  filteredOptions: Observable<string[]>;

  ngOnInit(): void {
    this.personForm(),
      this.productForm(),

      this._http.get('https://web.bizsol.in/crmapitest/api/AccountMaster/GetNestedDealerList?UserMaster_Code=0&MarketingManMaster_Code=0').subscribe(res => {
        this.companyList = res;
      })
    this.setMinDate()
  }
  ngOnChanges(changes: SimpleChanges): void { }

  // Function to handle input change and filter non-numeric characters
  pinAcceptOnlyNumber(event: any) {
    const inputValue: string = event.target.value;
    // Remove non-numeric characters
    const newValue = inputValue.replace(/[^0-9]/g, ''); 
    // Limit input to 10 characters
    this.newCustomerForm.get('pin').setValue(newValue.slice(0, 10)); 
    console.log("object", newValue);
    this.pinCode(newValue)
  }

  onInputChange(event: any) {
    const inputValue: string = event.target.value;
    // Remove non-numeric characters
    const newValue = inputValue.replace(/[^0-9]/g, ''); 
     // Limit input to 10 characters
    this.newCustomerForm.get('pno').setValue(newValue.slice(0, 10));
  }
  onInputChange1(event: any) {
    const inputValue: string = event.target.value;
    // Remove non-numeric characters
    const newValue = inputValue.replace(/[^0-9]/g, ''); 
    this.contactPerson.get('contactNo').setValue(newValue.slice(0, 10)); 
    // Limit input to 10 characters
  }
  onInputChangeProductQuantity(event: any) {
    const inputValue: string = event.target.value;
    const newValue = inputValue.replace(/[^0-9]/g, ''); // Remove non-numeric characters
    this.productDetails.get('quantity').setValue(newValue.slice(0, 10)); // Limit input to 10 characters
  }
  getCurrentDate(): string {
    // Get the current date in the format 'YYYY-MM-DD'
    const currentDate: Date = new Date();
    const year: number = currentDate.getFullYear();
    const month: number = currentDate.getMonth() + 1;
    const day: number = currentDate.getDate();
    return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
  }
  productsMethods() {
    this.productSpecification(),
      this.UOMList(),
      this.getProduct()
  }
  setMinDate() {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }
  setMaxDate() {
    const referenceDate = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('dateInput') as HTMLInputElement;
    dateInput.max = referenceDate;
  }

  enquiryForm() {
    this.newCustomerForm = this.fb.group({
      customerType: ['', Validators.required],
      // customername: ['', Validators.required],
      enquirytype: ['', Validators.required],
      existingCompany: ['', Validators.required],
      pin: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(6)]],
      country: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      email: ['', Validators.email],
      pno: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      website: [''],
      address1: ['', Validators.required],
      address2: [''],
      enquiryDate: [this.getCurrentDate(), Validators.required],
      leadsource: ['select', Validators.required],
      saleman: [''],
      referenceby: [''],
      referenceDate: [''],
      followupdate: ['', Validators.required],
      followupmode: ['', Validators.required],
      attachment: [''],
      customOption: [''],
      remark: ['']
    })
  }
  
  onKeyPress(event: KeyboardEvent) {
    const allowedChars = /^[a-zA-Z0-9@.]*$/;
    const inputChar = String.fromCharCode(event.charCode);

    if (!allowedChars.test(inputChar)) {
      event.preventDefault();
    }
  }

  pinPoppulate() {
    console.log('getPincode:', this.getPincode); // Log getPincode object to console

    // // Check if getPincode data is available
    // if (!this.getPincode || !this.getPincode.StateName || !this.getPincode.StateName || !this.getPincode.CountryName) {
    //   console.error('getPincode data is not available');
    //   return;
    // }

    // Populate only specific form fields
    const formValues = {
      country: this.getPincode.CountryName,
      state: this.getPincode.StateName,
      city: this.getPincode.CityName,
    };

    console.log('Form values to be patched:', formValues); // Log form values to be patched

    // Patch only the specified form fields
    this.newCustomerForm.patchValue(formValues);

    console.log("Successfully populated form fields:", formValues);
  }

  personForm() {
    this.contactPerson = this.fb.group({
      name: ['', Validators.required],
      department: ['select', Validators.required],
      designation: ['select', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      contactNo: ['', [Validators.required, Validators.maxLength(14), Validators.pattern("^[0-9]*$")]],
    })
  }
  productForm() {
    this.productDetails = this.fb.group({
      productName: ['select', Validators.required],
      specification: ['select', Validators.required],
      uom: ['select', Validators.required],
      quantity: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      remark: ['']
    })
  }

  newCustomer() {
    const Obj = {
      "enquiryMaster": [
        {
          AccountDesp: this.newCustomerForm.value.existingCompany,
          pinCode: this.newCustomerForm.value.pin,
          nation: this.newCustomerForm.value.country,
          state: this.newCustomerForm.value.state,
          city: this.newCustomerForm.value.city,
          eMail: this.newCustomerForm.value.email,
          mobileNo: this.newCustomerForm.value.pno,
          address1: this.newCustomerForm.value.address1,
          address2: this.newCustomerForm.value.address2,
          enquiryDate: this.newCustomerForm.value.enquiryDate,
          // referenceNo: this.newCustomerForm.value.referenceNo,
          referenceDate: this.newCustomerForm.value.referenceDate,
          isAttachmentExists: '',
          remark: this.newCustomerForm.value.remark,
          "verifiedOn": "",
          "status": "I"
        }
      ]
    }
    this._enquiryService.postEnquiry(Obj).subscribe(res => {
      this.newCode = res.Code;
      console.log("enquiryMaster", Obj);
      this.enquiryFormSubmitted = true;
      this.contactPersonTab = true;
      this.switchToContactTab();
      this.getEnquirByCode()
    })
  }

  // switchToContactTab() {
  //   const contactTabPane = this.elementRef.nativeElement.querySelector('#contact-tab-pane');
  //   if (contactTabPane) {
  //     contactTabPane.classList.add('show', 'active');
  //   }
  // }
  // switchToProductTab() {
  //   const profileTabPane = this.elementRef.nativeElement.querySelector('#profile-tab-pane');
  //   if (profileTabPane) {
  //     profileTabPane.classList.add('show', 'active');
  //   }
  // }


  switchToContactTab() {
    this.activateTab('#contact-tab', '#contact-tab-pane');
  }

  switchToEnquiryTab() {
    this.enquiryFormSubmitted = false;  // Reset the form submission flag
    this.newCustomerForm.reset();  // Reset the form
    this.activateTab('#home-tab', '#home-tab-pane');
  }

  activateTab(tabSelector: string, tabPaneSelector: string) {
    // Remove active class from currently active tab and tab pane
    const activeTab = this.elementRef.nativeElement.querySelector('.nav-link.active');
    const activeTabPane = this.elementRef.nativeElement.querySelector('.tab-pane.show.active');
    if (activeTab) activeTab.classList.remove('active');
    if (activeTabPane) activeTabPane.classList.remove('show', 'active');

    // Add active class to the specified tab and tab pane
    const tab = this.elementRef.nativeElement.querySelector(tabSelector);
    const tabPane = this.elementRef.nativeElement.querySelector(tabPaneSelector);
    if (tab) tab.classList.add('active');
    if (tabPane) tabPane.classList.add('show', 'active');
  }


  savePersonDetails() {
    const Obj = {
      "enquiryMaster": [
        {
          Code: this.newCode,
          AccountDesp: this.newCustomerForm.value.companyName,
          pinCode: this.newCustomerForm.value.pin,
          nation: this.newCustomerForm.value.country,
          state: this.newCustomerForm.value.state,
          city: this.newCustomerForm.value.city,
          eMail: this.newCustomerForm.value.email,
          mobileNo: this.newCustomerForm.value.pno,
          address1: this.newCustomerForm.value.address1,
          address2: this.newCustomerForm.value.address2,
          enquiryDate: this.newCustomerForm.value.enquiryDate,
          referenceNo: this.newCustomerForm.value.referenceNo,
          referenceDate: this.newCustomerForm.value.referenceDate,
          remark: this.newCustomerForm.value.remark,
          "verifiedOn": ""
        }
      ],
      "contactPersonsList": [
        {
          EnquiryMaster_Code: this.newCode,
          contactPersonName: this.contactPerson.value.name,
          contactPersonMobile: this.contactPerson.value.contactNo,
          contactPersonEMail: this.contactPerson.value.email,
          contactPersonDesignation: this.contactPerson.value.designation,
          departmentName: this.contactPerson.value.department,
        }
      ]
    }
    this._contactPersonService.postPersonDetails(Obj).subscribe(res => {
      this.contactPerson.reset();
      this.productDetailsTab = true;
      // this.switchToProductTab()
      this.getEnquirByCode()
    })
  }
  getEnquirByCode() {
    this.newCode && this._enquiryService.GetEnquiryDetailsByCode(this.newCode).subscribe((res: any) => {
      this.contactPersonsList = res.ContactPersonsList;
      this.enquiryProductDetails = res.EnquiryDetails;
      // this.followupDetail = res.EnquiryFollowupDetail[0];
      console.log("EnquiryProductDetails--->", this.enquiryProductDetails);
    })
  }

  saveProductDetails() {
    const Obj = {
      "enquiryMaster": [
        {
          Code: this.newCode,
          AccountDesp: this.newCustomerForm.value.companyName,
          pinCode: this.newCustomerForm.value.pin,
          nation: this.newCustomerForm.value.country,
          state: this.newCustomerForm.value.state,
          city: this.newCustomerForm.value.city,
          eMail: this.newCustomerForm.value.email,
          mobileNo: this.newCustomerForm.value.pno,
          address1: this.newCustomerForm.value.address1,
          address2: this.newCustomerForm.value.address2,
          enquiryDate: this.newCustomerForm.value.enquiryDate,
          referenceNo: this.newCustomerForm.value.referenceNo,
          referenceDate: this.newCustomerForm.value.referenceDate,
          remark: this.newCustomerForm.value.remark,
          "verifiedOn": ""
        }
      ],
      "enquiryDetails": [
        {
          EnquiryMaster_Code: this.newCode,
          itemName: this.productDetails.value.productName,
          sizeDetails: this.productDetails.value.specification,
          quantity: this.productDetails.value.quantity,
          uom: this.productDetails.value.uom,
          remarks: this.productDetails.value.remark,
          "verifiedDate": "",
          "updatedDate": ""
        }
      ]
    }
    this.productDetailsService.postProductDetails(Obj).subscribe(res => {

      this.productDetails.reset();
      this.getEnquirByCode()
    })
  }

  pinCode(val) {
    // const val = (event.target as HTMLSelectElement).value;
    this.newCustomerForm.get('pin').setValue(val); // Set the value in the form control
    console.log("pincode method", val);
    this._enquiryService.pincode(val).subscribe(res => {
      this.getPincode = res;
      this.state(this.getPincode.CountryName);
      this.city(this.getPincode.StateName)
      // Call pinPoppulate() after getPincode data is available
      this.pinPoppulate();
    })
  }

  getState(event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    console.log("selectedValue", selectedValue);
    this.newCustomerForm.get('country').setValue(selectedValue); // Set the value in the form control

    this._state.getStates(selectedValue).subscribe((res: any) => {
      this.stateList = res;
    })
  }

  state(val) {
    this._state.getStates(val).subscribe(res => {
      this.stateList = res;
    })
  }
  city(val) {
    this._city.getCity(val).subscribe(res => {
      this.cityList = res;
    });
  }

  getCityList(event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    // set state input value of form control named 'state' in form group
    this.newCustomerForm.get('state').setValue(selectedValue); // Set the value in the form control

    this._city.getCity(selectedValue).subscribe((res: any) => {
      this.cityList = res;
    });
  }

  getLeadSource() {
    this._enquiryService.leadSource().subscribe(res => {
      this.leadSourceList = res;
    })
  }

  getSalesPerson() {
    this._enquiryService.salePerson().subscribe(res => {
      this.salePersonList = res;
    })
  }

  departmentApi(): Observable<any> {
    let url = this._urlService.API_ENDPOINT_DEPARTMENT + "/GetDepartmentMasterList";
    return this._http.get(url, { headers: this.headers });
  }
  getDepartment() {
    this.departmentApi().subscribe(res => {
      this.departments = res;
    })
  }
  getDesignation() {
    this._contactPersonService.personDesignation().subscribe(res => {
      this.designation = res;
    })
  }

  UOMList() {
    this.productDetailsService.getUOM().subscribe(res => {
      this.UOM = res;
    })
  }
  getIndustryType() {
    this._enquiryService.industryType().subscribe(res => {
      this.industryType = res;
    })
  }
  getProduct() {
    this.productDetailsService.getProduct().subscribe((res: any[]) => {
      this.productList = res;

    })
  }
  productSpecification() {
    this.productDetailsService.getSpecification('').subscribe(res => {
      this.Specification = res;

    })
  }

  // onFollowupModeChange(): void {
  //   const followupmodeControl = this.newCustomerForm.get('followupmode');
  //   if (followupmodeControl.value === 'others') {
  //     this.newCustomerForm.get('customOption').setValidators(Validators.required);
  //   } else {
  //     this.newCustomerForm.get('customOption').clearValidators();
  //   }
  //   this.newCustomerForm.get('customOption').updateValueAndValidity();
  // }


  backtotable() {
    this.location.back();
  }

  deleteCustomerDetails(Code: any): void {
    const dialogRef = this.dialog.open(DeleteConfermationPopUpComponent, {
      width: '375px',
      data: { message: 'Are you sure you want to delete this followUp?', code: Code }
    });

    dialogRef.afterClosed().subscribe(result => {
      // if (result) {
      //   // User confirmed deletion, proceed with deletion
      //   this._enquiryService.deleteContactPersionDetails(Code).subscribe(() => {
      //     console.log(`${Code} has been deleted`);
      //     const index = this.dataSource.data.findIndex(item => item.Code === Code); 
      //     if (index > -1) {
      //       // Remove the row from the data source
      //       this.dataSource.data.splice(index, 1);
      //       // Update the MatTableDataSource to reflect the changes
      //       this.dataSource = new MatTableDataSource(this.dataSource.data);
      //     }
      //   });
      // }
    });
  }
}
