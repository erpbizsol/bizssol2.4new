import { Component, OnInit, ViewChild, ChangeDetectorRef, inject, ElementRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators, } from '@angular/forms';
import { EnquiryService } from 'src/app/services/Transaction/enquiry.service';
import { ContactPersonService } from 'src/app/services/Master/contact-person.service';
import { ProductDetailsService } from 'src/app/services/Master/product-details.service';
import { StateService } from 'src/app/services/Master/state.service';
import { CityService } from 'src/app/services/Master/city.service';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { UrlService } from 'src/app/services/URL/url.service';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { DatePipe, Location, CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfermationPopUpComponent } from 'src/app/pop-up/delete-confermation/delete-confermation-pop-up/delete-confermation-pop-up.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SnackBarService } from 'src/app/services/SnakBar-Service/snack-bar.service';

@Component({
  selector: 'app-edit-lead',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, MatFormFieldModule, MatListModule, MatSelectModule, CommonModule, MatTooltipModule],
  providers: [EnquiryService, SnackBarService, StateService, CityService, ContactPersonService, ProductDetailsService, DatePipe],
  templateUrl: './edit-lead.component.html',
  styleUrl: './edit-lead.component.scss'
})
export class EditLeadComponent implements OnInit {
  enquiryFormSubmitted: boolean = false;
  newCode: number;
  leadCode: any;
  contactPersonCode: number;
  productDetailsCode: any;
  code: number;

  leadData: any = [];
  contactPersonsList: any = [];
  enquiryProductDetails: any = [];
  followupDetail: any = [];

  minDate: string;
  minDate1: string;
  maxDate: string;

  newCustomerForm: FormGroup;
  contactPerson: FormGroup;
  productDetails: FormGroup;

  customerTypeList: any[] = [];
  EnquiryTypeList: any[] = [];
  countryList: any[] = [];
  stateList: any[] = [];
  cityList: any[] = [];
  leadSourceList: any[] = [];
  salePersonList: any = [];
  departments: any = [];
  designation: any = [];
  UOM: any = [];
  industryType: any = [];
  productList: any = [];
  Specification: any = [];
  getPincode: any = [];
  selectedrow: any;
  dataSource: MatTableDataSource<any>;
  uomDecimalPoints: number = 2; // Default decimal points

  private headers = new HttpHeaders({
    'Content-Type': 'application/json; charset=utf-8',
    // 'Authorization': this.authservice.getAccessTokenNew()
  });

  constructor(private fb: FormBuilder, private _enquiryService: EnquiryService, private _state: StateService, private _city: CityService, private location: Location,
    private _http: HttpClient, private _urlService: UrlService, private _changeDetect: ChangeDetectorRef, private elementRef: ElementRef,
    private _contactPersonService: ContactPersonService, private productDetailsService: ProductDetailsService, private route: ActivatedRoute,
    private datePipe: DatePipe, private dialog: MatDialog, private snackBarService: SnackBarService
  ) {
    this.dropdown(),
      this.enquiryForm(),
      this.personForm(),
      this.productForm()
  }

  ngOnInit(): void {
    this.getDepartment(),
      this.getDesignation(),
      this.UOMList(),
      this.getProduct(),
      // this.getProductDetails(this.productList[0].ItemName);
      this.getLeadSource(),
      this.getSalesPerson(),
      this.setMinAndMaxDate()
    this.setMinDate1()
  }

  switchToContactTab() {
    this.activateTab('#contact-tab', '#contact-tab-pane');
  }
  // switchToEnquiryTab() {
  //   this.enquiryFormSubmitted = false;  // Reset the form submission flag
  //   this.newCustomerForm.reset();  // Reset the form
  //   this.activateTab('#home-tab', '#home-tab-pane');
  // }
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


  dropdown(): void {
    const customerType = {
      tableName: "AccountMaster",
      fieldName: "AccountCategory",
      fieldNameOrderBy: "",
      distinct: "Y",
      filterCondition: "And AccountCategory<>''"
    }
    this._http.post(this._urlService.API_ENDPOINT_DROPDOWND, customerType).subscribe((res: any) => {
      this.customerTypeList = res;

      this._http.get(this._urlService.API_ENDPOINT_COUNTRY + '/GetCountryMasterList').subscribe((res: any) => {
        this.countryList = res;
      })
    })

    const EnquiryType = {
      "tableName": "F_Common_ClientVendor",
      "fieldName": "EnquiryType",
      "fieldNameOrderBy": "EnquiryType",
      "distinct": "Y",
      "filterCondition": "And EnquiryType<>''"
    }
    this._http.post(this._urlService.API_ENDPOINT_DROPDOWND, EnquiryType).subscribe((res: any) => {
      this.EnquiryTypeList = res;

      this.route.params.subscribe(params => {
        this.code = params['Code'];
        console.log("object", this.code);
        this.GetEnquiryDetailsByCode()
      });
    })

  }
  // setMinDate() {
  //   const today = new Date();
  //   const previousDate = new Date(today);
  //   previousDate.setDate(today.getDate() - 7);
  //   this.minDate = previousDate.toISOString().split('T')[0];
  // }

  setMinAndMaxDate() {
    const today = new Date();
    const previousDate = new Date(today);
    previousDate.setDate(today.getDate() - 7);
    this.minDate = previousDate.toISOString().split('T')[0];
    this.maxDate = today.toISOString().split('T')[0];
  }

  setMinDate1() {
    const today = new Date();
    const previousDate = new Date(today);
    previousDate.setDate(today.getDate());
    this.minDate1 = previousDate.toISOString().split('T')[0];
  }
  setMaxDate() {
    const referenceDate = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('dateInput') as HTMLInputElement;
    dateInput.max = referenceDate;
  }
  pinAcceptOnlyNumber(event: any) {
    const inputValue: string = event.target.value;
    const newValue = inputValue.replace(/[^0-9]/g, ''); // Remove non-numeric characters
    this.newCustomerForm.get('pin').setValue(newValue.slice(0, 10)); // Limit input to 10 characters
    this.pinCode(newValue)
  }
  onInputChange(event: any) {
    const inputValue: string = event.target.value;
    const newValue = inputValue.replace(/[^0-9]/g, ''); // Remove non-numeric characters
    this.newCustomerForm.get('pno').setValue(newValue.slice(0, 10)); // Limit input to 10 characters
  }
  onInputChange1(event: any) {
    const inputValue: string = event.target.value;
    const newValue = inputValue.replace(/[^0-9]/g, ''); // Remove non-numeric characters
    this.contactPerson.get('contactNo').setValue(newValue.slice(0, 10)); // Limit input to 10 characters
  }
  getCurrentDate(): string {
    // Get the current date in the format 'YYYY-MM-DD'
    const currentDate: Date = new Date();
    const year: number = currentDate.getFullYear();
    const month: number = currentDate.getMonth() + 1;
    const day: number = currentDate.getDate();
    return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
  }
  GetEnquiryDetailsByCode(): void {
    this._enquiryService.GetEnquiryDetailsByCode(this.code).subscribe((res: any) => {
      this.leadData = res.EnquiryMaster[0];
      this.contactPersonsList = res.ContactPersonsList;
      this.enquiryProductDetails = res.EnquiryDetails;
      // this.followupDetail = res.EnquiryFollowupDetail[0];
      console.log("GetEnquiryDetailsByCode", this.leadData);
      this.populateForm();
    })
  }
  getEnquirByCode() {
    this.code && this._enquiryService.GetEnquiryDetailsByCode(this.code).subscribe((res: any) => {
      this.contactPersonsList = res.ContactPersonsList;
      this.enquiryProductDetails = res.EnquiryDetails;
      // this.followupDetail = res.EnquiryFollowupDetail[0];
      console.log("EnquiryProductDetails--->", this.contactPersonsList);
    })
  }
  onKeyPress(event: KeyboardEvent) {
    const allowedChars = /^[a-zA-Z0-9@.]*$/;
    const inputChar = String.fromCharCode(event.charCode);

    if (!allowedChars.test(inputChar)) {
      event.preventDefault();
    }
  }
  onInput(event: KeyboardEvent) {
    const allowedChars = /^[A-Za-z\s]*$/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!allowedChars.test(inputChar)) {
      event.preventDefault();
    }
  }
  getTextOnly(event: any) {
    const inputValue: string = event.target.value;
    const newValue = inputValue.replace(/[^A-Za-z\s]/g, ''); // Remove non-alphanumeric characters and spaces
    this.contactPerson.get('name').setValue(newValue); // No limit on characters
  }


  productForm() {
    this.productDetails = this.fb.group({
      productName: ['', Validators.required],
      specification: ['', Validators.required],
      uom: ['', Validators.required],
      quantity: ['0.000', [Validators.required, this.validateDecimalPoints(this.uomDecimalPoints)]],
      remark: ['']
    });

    // Subscribe to changes in the uom field
    this.productDetails.get('uom').valueChanges.subscribe(value => {
      this.onUomChange(value);
    });
  }
  validateDecimalPoints(decimalPoints: number) {
    return (control: AbstractControl) => {
      const regex = new RegExp(`^-?\\d*(\\.\\d{0,${decimalPoints}})?$`);
      if (!control.value || regex.test(control.value)) {
        return null;
      }
      return { invalidDecimal: true };
    };
  }
  onUomChange(uom: string) {
    const selectedUom = this.UOM.find(item => item.UOM === uom);
    if (selectedUom) {
      this.uomDecimalPoints = selectedUom.DecimalPoints || 2;
      const quantityControl = this.productDetails.get('quantity');
      quantityControl.setValidators([Validators.required, this.validateDecimalPoints(this.uomDecimalPoints)]);
      quantityControl.updateValueAndValidity();
    }
  }
  onInputChangeProductQuantity(event: any) {
    const inputValue: string = event.target.value;
    const regex = new RegExp(`^-?\\d*(\\.\\d{0,${this.uomDecimalPoints}})?$`);

    if (!regex.test(inputValue)) {
      // Remove all non-numeric characters except for the first dot
      let cleanedValue = inputValue.replace(/[^0-9.]/g, '');

      // Allow only one decimal point
      const dotIndex = cleanedValue.indexOf('.');
      if (dotIndex !== -1) {
        cleanedValue = cleanedValue.substring(0, dotIndex + 1) + cleanedValue.substring(dotIndex + 1).replace(/\./g, '');
      }

      // Limit the number of decimal places
      const parts = cleanedValue.split('.');
      if (parts.length > 1 && parts[1].length > this.uomDecimalPoints) {
        parts[1] = parts[1].substring(0, this.uomDecimalPoints);
      }

      this.productDetails.get('quantity').setValue(parts.join('.'));
    } else {
      this.productDetails.get('quantity').setValue(inputValue);
    }
  }

  enquiryForm() {
    this.newCustomerForm = this.fb.group({
      customerType: ['', Validators.required],
      customername: ['', Validators.required],
      enquirytype: ['', Validators.required],
      pin: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(6)]],
      country: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      email: ['', [Validators.email, Validators.pattern('^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$')]],
      pno: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(10)]],
      website: ['', Validators.pattern(/^(https?:\/\/)?([\da-zA-Z.-]+)\.([a-zA-Z.]{2,6})([/\w .-]*)*\/?$/)],
      address1: ['', Validators.required],
      address2: [''],
      enquiryDate: [this.getCurrentDate(), Validators.required],
      leadsource: ['', Validators.required],
      salesman: [''],
      referenceby: [''],
      referenceDate: [''],
      followupdate: ['', Validators.required],
      followupmode: ['', Validators.required],
      attachment: [''],
      remark: ['']
    })
  }
  get website() {
    return this.newCustomerForm.get('website');
  }
  get email() {
    return this.newCustomerForm.get('email');
  }
  populateForm(): void {
    const enquiryDate = this.datePipe.transform(this.leadData.EnquiryDate, 'yyyy-MM-dd');
    const referenceDate = this.datePipe.transform(this.leadData.ReferenceDate, 'yyyy-MM-dd');
    const followupdate = this.datePipe.transform(this.leadData.NextFollowupdate, 'yyyy-MM-dd');
    console.log(followupdate);

    // Patch the fetched data into the form
    this.newCustomerForm.patchValue({
      code: this.leadData.Code,
      customerType: this.leadData.CustomerType,
      customername: this.leadData.AccountDesp,
      enquirytype: this.leadData.EnquirytypeName,
      pin: this.leadData.PinCode,
      country: this.leadData.Nation,
      state: this.leadData.State,
      city: this.leadData.City,
      email: this.leadData.EMail,
      pno: this.leadData.MobileNo,
      website: this.leadData.Website,
      address1: this.leadData.Address1,
      address2: this.leadData.Address2,
      enquiryDate: enquiryDate,
      leadsource: this.leadData.LeadSourceDespName,
      salesman: this.leadData.PersonName,
      referenceby: this.leadData.ReferenceBy,
      referenceDate: referenceDate,
      followupdate: followupdate,
      followupmode: this.leadData.NextFollowupmode,
      // attachment: this.leadData.IsAttachmentExists,
      remark: this.leadData.Remark,
    });
    console.log("object", this.newCustomerForm.value);
    console.log("object", this.newCustomerForm.value.country);
    this._http.get(this._urlService.API_ENDPOINT_STATE + `/GetStateList?CountryName=${this.newCustomerForm.value.country}`).subscribe((res: any) => {
      this.stateList = res;
    }),
      this._http.get(this._urlService.API_ENDPOINT_CITY + `/GetCityList?StateName=${this.newCustomerForm.value.state}`).subscribe((res: any) => {
        this.cityList = res;
      })
  }
  personForm() {
    this.contactPerson = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9\\s]+$')]],
      department: ['', Validators.required],
      designation: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$')]],
      contactNo: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(10)]],
    })
  }

  resetForm() {
    this.productDetails.reset({
      productName: '',
      specification: '',
      quantity: '',
      uom: '',
      remark: '' // Explicitly set to an empty string
    });
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
  pinPoppulate() {
    const formValues = {
      country: this.getPincode.CountryName,
      state: this.getPincode.StateName,
      city: this.getPincode.CityName,
    };
    this.newCustomerForm.patchValue(formValues);
  }

  getState(event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    console.log("selectedValue", selectedValue);
    this.newCustomerForm.get('country').setValue(selectedValue); // Set the value in the form control

    this._state.getStates(selectedValue).subscribe((res: any) => {
      this.stateList = res;
    })
  }
  getCityList(event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    // set state input value of form control named 'state' in form group
    this.newCustomerForm.get('state').setValue(selectedValue); // Set the value in the form control

    this._city.getCity(selectedValue).subscribe((res: any) => {
      this.cityList = res;
    });
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
  getLeadSource() {
    this._enquiryService.leadSource().subscribe((res: any) => {
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

  getProduct(): void {
    this.productDetailsService.getProduct().subscribe(res => {
      this.productList = res;
      console.log("this.productList", this.productList[0].ItemName);
    })
    // this.getProductDetails(this.productList[0].ItemName);
  }
  onProductChange(event: any): void {
    const selectedProductName = event.target.value;
    const selectedProduct = this.productList.find(product => product.ItemName === selectedProductName);
    if (selectedProduct) {
      this.productDetails.patchValue({ uom: selectedProduct.UOM });
    }
    this.productSpecification(event)
  }
  getProductDetails(val: any) {
    this.productDetailsService.getSpecification(val).subscribe(res => {
      this.Specification = res;
      console.log("response", res);
    })
  }
  productSpecification(event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    console.log("object", selectedValue);
    this.productDetailsService.getSpecification(selectedValue).subscribe(res => {
      this.Specification = res;
    })
  }
  UOMList() {
    this.productDetailsService.getUOM().subscribe(res => {
      this.UOM = res;
    })
  }

  CheckDuplicateEmail(obj: any) {
    this._enquiryService.CheckDuplicateEnquiryContactDetail(obj).subscribe(res => {
      console.log("object-Abhishek Raut", res);
    })
  }

  updateLead(code: number) {
    const Obj = {
      "enquiryMaster": [
        {
          code: this.code,
          customerType: this.newCustomerForm.value.customerType,
          accountDesp: this.newCustomerForm.value.customername,
          enquirytypeName: this.newCustomerForm.value.enquirytype,
          pinCode: this.newCustomerForm.value.pin,
          nation: this.newCustomerForm.value.country,
          state: this.newCustomerForm.value.state,
          city: this.newCustomerForm.value.city,
          eMail: this.newCustomerForm.value.email,
          mobileNo: this.newCustomerForm.value.pno,
          website: this.newCustomerForm.value.website,
          address1: this.newCustomerForm.value.address1,
          address2: this.newCustomerForm.value.address2,
          enquiryDate: this.newCustomerForm.value.enquiryDate,
          leadSourceDespName: this.newCustomerForm.value.leadsource,
          referenceBy: this.newCustomerForm.value.referenceby,
          referenceDate: this.newCustomerForm.value.referenceDate,
          personName: this.newCustomerForm.value.salesman,
          isAttachmentExists: '',
          NextFollowupdate: this.newCustomerForm.value.followupdate,
          NextFollowupmode: this.newCustomerForm.value.followupmode,
          remark: this.newCustomerForm.value.remark,
          "verifiedOn": ""
        }
      ]
    }
    this._enquiryService.postEnquiry(Obj).subscribe(res => {
      this.snackBarService.showSuccessMessage('Enquiry details updated successfully!');
      this.switchToContactTab();
      this.getEnquirByCode();
    },
    err => {
      this.snackBarService.showErrorMessage(' Failed to update Enquiry details');
    })
    // this.newCustomerForm.reset();

  }
  savePersonDetails() {
    console.log("object", this.contactPersonCode);
    const Obj = {
      enquiryMaster: [
        {
          Code: this.code,
          customerType: this.newCustomerForm.value.customerType,
          accountDesp: this.newCustomerForm.value.customername,
          enquirytypeName: this.newCustomerForm.value.enquirytype,
          pinCode: this.newCustomerForm.value.pin,
          nation: this.newCustomerForm.value.country,
          state: this.newCustomerForm.value.state,
          city: this.newCustomerForm.value.city,
          eMail: this.newCustomerForm.value.email,
          mobileNo: this.newCustomerForm.value.pno,
          website: this.newCustomerForm.value.website,
          address1: this.newCustomerForm.value.address1,
          address2: this.newCustomerForm.value.address2,
          enquiryDate: this.newCustomerForm.value.enquiryDate,
          leadSourceDespName: this.newCustomerForm.value.leadsource,
          referenceBy: this.newCustomerForm.value.referenceby,
          referenceDate: this.newCustomerForm.value.referenceDate,
          personName: this.newCustomerForm.value.salesman,
          isAttachmentExists: '',
          NextFollowupdate: this.newCustomerForm.value.followupdate,
          NextFollowupmode: this.newCustomerForm.value.followupmode,
          remark: this.newCustomerForm.value.remark,
          "verifiedOn": ""
        }
      ],
      contactPersonsList: [
        {
          EnquiryMaster_Code: this.code,
          Code: this.contactPersonCode,
          contactPersonName: this.contactPerson.value.name,
          contactPersonMobile: this.contactPerson.value.contactNo,
          contactPersonEMail: this.contactPerson.value.email,
          contactPersonDesignation: this.contactPerson.value.designation,
          departmentName: this.contactPerson.value.department,
        }
      ]
    };
    this._enquiryService.CheckDuplicateEnquiryContactDetail(Obj).subscribe((res: any) => {
      if (res.Status == "Y") {
        this._contactPersonService.postPersonDetails(Obj).subscribe(res => {
          this.contactPerson.reset();
          this.contactPersonCode = undefined;
          this.getEnquirByCode();
          this.snackBarService.showSuccessMessage('Contact person details updated successfully!');
        },
          err => {
            this.snackBarService.showErrorMessage('Failed to update Contact person details');
          })
      } else {
        alert(res.Msg)
      }
    })

  }
  saveProductDetails() {
    const Obj = {
      "enquiryMaster": [
        {
          Code: this.code,
          customerType: this.newCustomerForm.value.customerType,
          accountDesp: this.newCustomerForm.value.customername,
          enquirytypeName: this.newCustomerForm.value.enquirytype,
          pinCode: this.newCustomerForm.value.pin,
          nation: this.newCustomerForm.value.country,
          state: this.newCustomerForm.value.state,
          city: this.newCustomerForm.value.city,
          eMail: this.newCustomerForm.value.email,
          mobileNo: this.newCustomerForm.value.pno,
          website: this.newCustomerForm.value.website,
          address1: this.newCustomerForm.value.address1,
          address2: this.newCustomerForm.value.address2,
          enquiryDate: this.newCustomerForm.value.enquiryDate,
          leadSourceDespName: this.newCustomerForm.value.leadsource,
          referenceBy: this.newCustomerForm.value.referenceby,
          referenceDate: this.newCustomerForm.value.referenceDate,
          personName: this.newCustomerForm.value.salesman,
          isAttachmentExists: '',
          NextFollowupdate: this.newCustomerForm.value.followupdate,
          NextFollowupmode: this.newCustomerForm.value.followupmode,
          remark: this.newCustomerForm.value.remark,
          "verifiedOn": ""
        }
      ],
      "enquiryDetails": [
        {
          EnquiryMaster_Code: this.code,
          Code: this.productDetailsCode,
          itemName: this.productDetails.value.productName,
          sizeDetails: this.productDetails.value.specification,
          quantity: this.productDetails.value.quantity,
          uom: this.productDetails.value.uom,
          Remarks: this.productDetails.value.remark,
          "verifiedDate": "",
          "updatedDate": ""
        }
      ]
    }
    this.productDetailsService.postProductDetails(Obj).subscribe(res => {
      this.resetForm();
      this.productDetailsCode = undefined;
      this.getEnquirByCode();
      this.snackBarService.showSuccessMessage('Product details updated successfully!');
    },
      err => {
        this.snackBarService.showErrorMessage('Failed to update Product details');
      })

  }

  // Contact person update and delete method
  contactPersonUpdate(code: number) {
    this.contactPersonCode = code;
    console.log("person Code", code)

    this._enquiryService.GetEnquiryDetailsByCode(this.code).subscribe(res => {
      this.contactPersonsList = res.ContactPersonsList;
      this.enquiryProductDetails = res.EnquiryDetails;

      // Find the contact person by the provided code
      const selectedPerson = this.contactPersonsList.find(person => person.Code === code);
      if (selectedPerson) {
        this.personDataPopplate(selectedPerson)
      }
    })
  }
  personDataPopplate(person: any) {
    this.contactPerson.patchValue({
      name: person.ContactPersonName,
      department: person.DepartmentName,
      designation: person.ContactPersonDesignation,
      email: person.ContactPersonEMail,
      contactNo: person.ContactPersonMobile,
    })
  }
  deleteCustomerDetails(Code: any): void {
    const dialogRef = this.dialog.open(DeleteConfermationPopUpComponent, {
      width: '375px',
      data: { message: 'Are you sure you want to delete this followUp?', code: Code }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // User confirmed deletion, proceed with deletion
        const reason = result.reason;
        this._enquiryService.deleteContactPersionDetails(Code, reason).subscribe(() => {
          this.snackBarService.showSuccessMessage('Contact person details deleted successfully!');
          this.getEnquirByCode();
        },
          err => {
            this.snackBarService.showErrorMessage('Failed to delete Contact person details');
          });

      }
    }
    );
  }

  //product details update and delete method
  productDetailsUpdate(code: number) {
    this.productDetailsCode = code;
    console.log("product Code", code)
    this._enquiryService.GetEnquiryDetailsByCode(this.code).subscribe(res => {
      this.enquiryProductDetails = res.EnquiryDetails;
      console.log("product List", this.enquiryProductDetails);

      // Find the product by the provided code
      const selectedProduct = this.enquiryProductDetails.find(procuct => procuct.Code === code);
      if (selectedProduct) {
        this.poductDataPopplate(selectedProduct)
      }
      this.snackBarService.showSuccessMessage('Product details updated successfully!');

    },
    err => {
      this.snackBarService.showErrorMessage('Failed to update Product details');
    })

  }
  poductDataPopplate(procuct: any) {
    this.productDetails.patchValue({
      productName: procuct.ItemName,
      specification: procuct.SizeDetails,
      quantity: procuct.Quantity,
      uom: procuct.UOM,
      remark: procuct.Remarks
    })

    this._http.get(this._urlService.API_ENDPOINT_SPECIFICATION + '/GetItemSizeMasterList' + `?ItemName=${this.productDetails.value.productName}`).subscribe((res: any) => {
      this.Specification = res;
    })
  }
  deleteProductDetails(Code: any): void {
    const dialogRef = this.dialog.open(DeleteConfermationPopUpComponent, {
      width: '375px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const reason = result.reason;
        this._enquiryService.deleteProductDetails(Code, reason).subscribe(() => {
          this.getEnquirByCode();
          this.snackBarService.showSuccessMessage('Product details deleted successfully!');

        },
        err => {
          this.snackBarService.showErrorMessage('Failed to delete Product details');
        });

      }
    });
  }

  backtotable() {
    // this.snackBarService.showSuccessMessage('Enquiry saved successfully!');
    this.location.back();
  }
  // Choose File
  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement>;
  imageSrc: string | ArrayBuffer | null = null;

  setImage(): void {
    const input = this.fileInput.nativeElement;

    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        this.imageSrc = e.target?.result;
      };

      reader.readAsDataURL(file);
    }
  }

}