import { Component, OnInit, ViewChild, ChangeDetectorRef, ElementRef, Renderer2 } from '@angular/core';
import { FormsModule, FormControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSnackBarAction, MatSnackBarActions, MatSnackBarLabel } from '@angular/material/snack-bar';
import { EnquiryService } from 'src/app/services/Transaction/enquiry.service';
import { ContactPersonService } from 'src/app/services/Master/contact-person.service';
import { ProductDetailsService } from 'src/app/services/Master/product-details.service';
import { StateService } from 'src/app/services/Master/state.service';
import { CityService } from 'src/app/services/Master/city.service';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { AsyncPipe, CommonModule, DatePipe, Location } from '@angular/common';
import { UrlService } from 'src/app/services/URL/url.service';
import { Observable } from 'rxjs';
import { RouterLinkActive, RouterModule, ActivatedRoute } from '@angular/router';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfermationPopUpComponent } from 'src/app/pop-up/delete-confermation/delete-confermation-pop-up/delete-confermation-pop-up.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SnackBarService } from 'src/app/services/SnakBar-Service/snack-bar.service';

@Component({
  selector: 'app-new-customer',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, FormsModule, AsyncPipe, MatTooltipModule,
    HttpClientModule, MatSnackBarModule, MatFormFieldModule, MatListModule, MatSelectModule, CommonModule, MatInputModule, MatAutocompleteModule, MatSnackBarLabel, MatSnackBarActions, MatSnackBarAction],
  templateUrl: './new-customer.component.html',
  styleUrl: './new-customer.component.scss',
  providers: [EnquiryService, StateService, CityService, ContactPersonService, ProductDetailsService, SnackBarService, DatePipe]
})
export class NewCustomerComponent implements OnInit {
  imageSrc: string | ArrayBuffer | null = null;

  hidedetailsOfEnquiry: boolean = false;
  // Default decimal points
  uomDecimalPoints: number = 2;
  minDate: string;
  minDate1: string;
  maxDate: string
  enquiryFormSubmitted: boolean = false;
  companyNamehide: boolean = false;
  selected: string = 'new';
  editDisable: boolean = false;
  showExistPersonList: boolean = false;
  hideContactPersonControl: boolean = true;

  newCode: any;
  editCode: any;
  contactPersonCode: any;
  productDetailsCode: any;
  leadData: any = [];
  contactPersonsList: any = [];
  enquiryProductDetails: any = [];
  followupDetail: any = [];

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
  customerTypeList: any = [];
  companyList: any = [];
  companyDetails: any = [];
  EnquiryTypeList: any = [];
  selectedCustomerType: any = [];
  customerType: any

  dataSource: MatTableDataSource<any>;

  myControl: FormControl = new FormControl('');
  base64String: string;
  documentType: string;
  existingPersonNameList: any = [];

  constructor(private fb: FormBuilder, private _enquiryService: EnquiryService, private _state: StateService, private _city: CityService, private renderer: Renderer2, private el: ElementRef, private datePipe: DatePipe,
    private _http: HttpClient, private _urlService: UrlService, private _changeDetect: ChangeDetectorRef, private elementRef: ElementRef, private dialog: MatDialog, private _snackBar: MatSnackBar,
    private _contactPersonService: ContactPersonService, private _productDetailsService: ProductDetailsService, private route: ActivatedRoute, private location: Location, private snackBarService: SnackBarService
  ) {
    this.dropdown();
    this.newEnquiryForm();
    this.personForm();
    this.productForm();
    this._enquiryService = _enquiryService;
  }

  ngOnInit(): void {
    this.UOMList()
    this.getProduct()
    this.getLeadSource()
    this.getSalesPerson()
    this.getDepartment()
    this.getDesignation()
    this.setMinAndMaxDate()
    this.setMinDate1()
    this.productForm();
    // this.leadCode = this.route.snapshot.paramMap.get('Code');
    this.route.params.subscribe(params => {
      this.editCode = params['Code'];
      this.getEnquirByCode()
    });
  }

  // ngAfterViewInit() {
  //   const activeElement = this.el.nativeElement.querySelector('#active');
  //   const inactiveElement = this.el.nativeElement.querySelector('#inactive');

  //   if (activeElement && inactiveElement) {
  //     this.renderer.setStyle(activeElement.nextSibling, 'color', 'green');
  //     this.renderer.setStyle(inactiveElement.nextSibling, 'color', 'red');
  //   }
  // }

  showexisting() {
    this.companyNamehide = true;
    this.showExistPersonList = true;
    this.hideContactPersonControl = false;

    this.selected = 'existing';
    this._changeDetect.detectChanges;

    this.newCustomerForm.get('customername')?.reset();
    this.newCustomerForm.get('customerType')?.reset();
    this.newCustomerForm.get('pin')?.reset();
    this.newCustomerForm.get('country')?.reset();
    this.newCustomerForm.get('state')?.reset();
    this.newCustomerForm.get('city')?.reset();
    this.newCustomerForm.get('email')?.reset();
    this.newCustomerForm.get('pno')?.reset();
    this.newCustomerForm.get('website')?.reset();
    this.newCustomerForm.get('address1')?.reset();
    this.newCustomerForm.get('address2')?.reset();
    this.contactPerson.reset();

    this.customerType = {
      tableName: "AccountMaster",
      fieldName: "AccountDesp",
      fieldNameOrderBy: "",
      distinct: "Y",
      filterCondition: " AND Code in (Select Code From [Dbo].[UDF_GetNestedDealerList](0,0))"
    }
    this._http.post(this._urlService.API_ENDPOINT_DROPDOWND, this.customerType).subscribe((res: any) => {
      this.companyList = res;
    })
    // this.editCode = undefined;
  }
  hideexisting() {
    this.companyNamehide = false;
    this.showExistPersonList = false;
    this.hideContactPersonControl = true;

    this.selected = 'new';
    this._changeDetect.detectChanges();

    this.newCustomerForm.get('customername')?.reset();
    this.newCustomerForm.get('customerType')?.reset();
    this.newCustomerForm.get('pin')?.reset();
    this.newCustomerForm.get('country')?.reset();
    this.newCustomerForm.get('state')?.reset();
    this.newCustomerForm.get('city')?.reset();
    this.newCustomerForm.get('email')?.reset();
    this.newCustomerForm.get('pno')?.reset();
    this.newCustomerForm.get('website')?.reset();
    this.newCustomerForm.get('address1')?.reset();
    this.newCustomerForm.get('address2')?.reset();
    this.contactPerson.reset();
  }

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

  getEnquirByCode(): void {
    const enquiryCode = this.newCode == undefined ? this.editCode : this.newCode;
    this._enquiryService.GetEnquiryDetailsByCode(enquiryCode).subscribe((res: any) => {
      this.leadData = res.EnquiryMaster[0];
      this.contactPersonsList = res.ContactPersonsList;
      // res.ContactPersonsList = this.contactPersonsList;
      this.enquiryProductDetails = res.EnquiryDetails;

      if (this.editCode !== "undefined") {
        this.hidedetailsOfEnquiry = true;
        this.editDisable = true;
        this.enquiryFormSubmitted = true;
        if (this.leadData.CustomerFromMaster == "Y") {
          this.selected = 'existing';
          this.showExistPersonList = true;
          this.hideContactPersonControl = false;
        }
      }
      this.populateForm();
    })
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
        this.state('India');
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
    })
  }

  getCompanyDetails(event) {
    this.contactPerson.reset();
    const selectedCompany = (event.target as HTMLSelectElement).value;
    this._enquiryService.GetAccountDetails(selectedCompany).subscribe((res: any) => {
      this.companyDetails = res.AccountMaster[0];
      this.existingPersonNameList = res.AccountContactPersonDetail;
      this.state(this.companyDetails.Nation);
      this.city(this.companyDetails.State);

      this.companyDetailsPopulates();
    })
  }
  companyDetailsPopulates() {
    const data = {
      customerType: this.companyDetails.AccountCategory,
      pin: this.companyDetails.PinCode,
      country: this.companyDetails.Nation,
      state: this.companyDetails.State,
      city: this.companyDetails.City,
      email: this.companyDetails.EMail,
      pno: this.companyDetails.PhoneNo,
      website: this.companyDetails.WebSite,
      address1: this.companyDetails.Address1,
      address2: this.companyDetails.Address2
    }
    this.newCustomerForm.patchValue(data);
  }

  // Function to handle input change and filter non-numeric characters
  pinAcceptOnlyNumber(event: any) {
    const inputValue: string = event.target.value;
    const newValue = inputValue.replace(/[^0-9]/g, ''); // Remove non-numeric characters
    this.newCustomerForm.get('pin').setValue(newValue.slice(0, 10)); // Limit input to 10 characters
    this.pinCode(newValue)
  }
  // onInputChange(event: any) {
  //   const inputValue: string = event.target.value;
  //   const newValue = inputValue.replace(/[^0-9]/g, ''); // Remove non-numeric characters
  //   this.newCustomerForm.get('pno').setValue(newValue.slice(0, 10)); // Limit input to 10 characters
  // }

  onInputChange(event: any) {
    let inputValue: string = event.target.value;

    // Remove non-numeric characters
    inputValue = inputValue.replace(/[^0-9]/g, '');

    // If the first character is 0, remove it
    if (inputValue.startsWith('0')) {
      inputValue = inputValue.slice(1);
    }

    // Limit input to 10 characters
    const newValue = inputValue.slice(0, 10);

    // Set the modified value back to the form control
    this.newCustomerForm.get('pno').setValue(newValue);
  }

  onInputChange1(event: any) {
    const inputValue: string = event.target.value;
    let newValue = inputValue.replace(/[^0-9]/g, ''); // Remove non-numeric characters
    if (newValue.startsWith('0')) {
      newValue = inputValue.slice(1);
    }
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
  onKeyPress(event: KeyboardEvent) {
    const allowedChars = /^[a-zA-Z0-9@.]*$/;
    const inputChar = String.fromCharCode(event.charCode);

    if (!allowedChars.test(inputChar)) {
      event.preventDefault();
    }
  }

  //   onKeyPress(event: KeyboardEvent) {
  //     const allowedChars = /^[a-zA-Z0-9@.]*$/;
  //     let inputChar = String.fromCharCode(event.charCode);

  //     inputChar = inputChar.toUpperCase()
  //     console.log(inputChar,"kkk")


  //     if (!allowedChars.test(inputChar)) {
  //         event.preventDefault();
  //     }
  // }
  onInput(event: KeyboardEvent) {
    const allowedChars = /^[A-Za-z\s]*$/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!allowedChars.test(inputChar)) {
      event.preventDefault();
    }
  }

  newEnquiryForm() {
    const today = new Date().toISOString().split('T')[0];
    this.newCustomerForm = this.fb.group({
      customerType: ['', Validators.required],
      customername: ['', Validators.required],
      enquirytype: ['', Validators.required],
      pin: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(6)]],
      country: ['India', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      email: ['', [Validators.email, Validators.pattern('^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$')]],
      pno: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(10)]],
      website: ['', Validators.pattern(/^(https?:\/\/)?([\da-zA-Z.-]+)\.([a-zA-Z.]{2,6})([/\w .-]*)*\/?$/)],
      address1: ['', Validators.required],
      address2: [''],
      enquiryDate: [today, Validators.required],
      leadsource: ['', Validators.required],
      salesman: [''],
      referenceby: [''],
      referenceDate: [''],
      followupdate: ['', Validators.required],
      followupmode: ['', Validators.required],
      attachment: ['', [fileSizeValidator(2)]],
      customOption: [''],
      remark: ['']
    })
  }
  get website() {
    return this.newCustomerForm.get('website');
  }
  get email() {
    return this.newCustomerForm.get('email');
  }
  personForm() {
    this.contactPerson = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9\\s]+$')]],
      department: ['select', Validators.required],
      designation: ['select', Validators.required],
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$')]],
      contactNo: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(10)]],
    })
  }
  productForm() {
    this.productDetails = this.fb.group({
      productName: ['', Validators.required],
      specification: ['', Validators.required],
      uom: ['', Validators.required],
      quantity: ['', [Validators.required, this.validateDecimalPoints(this.uomDecimalPoints)]],
      remark: ['']
    });

    // Subscribe to changes in the uom field
    this.productDetails.get('uom').valueChanges.subscribe(value => {
      this.onUomChange(value);
    });
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

  getTextOnly(event: any) {
    const inputValue: string = event.target.value;
    const newValue = inputValue.replace(/[^A-Za-z\s]/g, ''); // Remove non-alphanumeric characters and spaces
    this.contactPerson.get('name').setValue(newValue); // No limit on characters
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

  getCompanyList(event) {
    const selectedCustomerType = (event.target as HTMLSelectElement).value;
    const customerType = {
      tableName: "AccountMaster",
      fieldName: "AccountDesp",
      fieldNameOrderBy: "",
      distinct: "Y",
      filterCondition: " AND Code in (Select Code From [Dbo].[UDF_GetNestedDealerList](0,0))"
    }
    this._http.post(this._urlService.API_ENDPOINT_DROPDOWND, customerType).subscribe((res: any) => {
      this.companyList = res;
    })
  }

  onInputChange2(event: any) {
    const inputValue: string = event.target.value;
    const formattedValue = this.capitalizeWords(inputValue);
    this.newCustomerForm.get('customername').setValue(formattedValue);
  }

  capitalizeWords(str: string): string {
    return str.replace(/(?:^|\s|\.)\S/g, (char) => char.toUpperCase());
  }

  pinCode(val) {
    // const val = (event.target as HTMLSelectElement).value;
    this.newCustomerForm.get('pin').setValue(val); // Set the value in the form control
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
    // Patch only the specified form fields
    this.newCustomerForm.patchValue(formValues);
  }

  getState(event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
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
    return this._http.get(url);
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
    this._productDetailsService.getProduct().subscribe((res: any[]) => {
      this.productList = res;
      // this.productList = this.productDetails.valueChanges
      //   .pipe(
      //     startWith(''),
      //     map(value => this._filter(value))
      //   );
      // console.log("filteredOptions", this.filteredOptions);
    })
  }
  onProductChange(event: any): void {
    const selectedProductName = event.target.value;
    const selectedProduct = this.productList.find(product => product.ItemName === selectedProductName);
    if (selectedProduct) {
      this.productDetails.patchValue({ uom: selectedProduct.UOM });
    }
    this.productSpecification(event)
  }
  productSpecification(event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this._productDetailsService.getSpecification(selectedValue).subscribe(res => {
      this.Specification = res;
    })
  }
  UOMList() {
    this._productDetailsService.getUOM().subscribe(res => {
      this.UOM = res;
    })
  }

  newCustomer() {
    this.editCode == "undefined" ? this.editCode = undefined : this.editCode;
    if (this.newCustomerForm.valid) {
      const Obj = {
        "enquiryMaster": [
          {
            code: this.newCode == undefined ? this.editCode : this.newCode,
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
            isAttachmentExists: this.base64String ? "Y" : "N",
            documentName: this.documentType,
            documentContent: this.base64String,
            NextFollowupdate: this.newCustomerForm.value.followupdate,
            NextFollowupmode: this.newCustomerForm.value.followupmode,
            remark: this.newCustomerForm.value.remark,
            "verifiedOn": "",
            "status": "I"
          }
        ]
      }
      this._enquiryService.postEnquiry(Obj).subscribe(res => {
        this.newCode = res.Code;
        this.enquiryFormSubmitted = true;
        this.switchToContactTab();
        this.hidedetailsOfEnquiry = true;
        this.getEnquirByCode();
        this.snackBarService.showSuccessMessage('Enquiry saved successfully!');
      },
        err => {
          this.snackBarService.showErrorMessage('Failed to save Enquiry');
        })
    } else {
      this.newCustomerForm.markAllAsTouched();
    }
  }
  populateForm() {
    this.documentType = this.leadData.DocumentName;
    this.base64String = this.leadData.DocumentContent;
    const image = "data:" + this.documentType + ";" + "base64," + this.base64String;
    if (image == "data:;base64,") {
      this.imageSrc = null;
    } else this.imageSrc = image;

    const enquiryDate = this.datePipe.transform(this.leadData.EnquiryDate, 'yyyy-MM-dd');
    const referenceDate = this.datePipe.transform(this.leadData.ReferenceDate, 'yyyy-MM-dd');
    const followupdate = this.datePipe.transform(this.leadData.NextFollowupdate, 'yyyy-MM-dd');

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
      attachment: this.leadData.IsAttachmentExists,
      followupdate: followupdate,
      followupmode: this.leadData.NextFollowupmode,
      remark: this.leadData.Remark,
    });

    // this._http.get(this._urlService.API_ENDPOINT_STATE + `/GetStateList?CountryName=${this.newCustomerForm.value.country}`).subscribe((res: any) => {
    //   this.stateList = res;
    // }),  
    this._http.get(this._urlService.API_ENDPOINT_CITY + `/GetCityList?StateName=${this.newCustomerForm.value.state}`).subscribe((res: any) => {
      this.cityList = res;
    })
  }

  // Contact person save, update and delete method
  savePersonDetails() {
    const Obj = {
      "enquiryMaster": [
        {
          code: this.newCode == undefined ? this.editCode : this.newCode,
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
          isAttachmentExists: this.base64String ? "Y" : "N",
          documentName: this.documentType,
          documentContent: this.base64String,
          NextFollowupdate: this.newCustomerForm.value.followupdate,
          NextFollowupmode: this.newCustomerForm.value.followupmode,
          remark: this.newCustomerForm.value.remark,
          "verifiedOn": "",
          "status": "I"
        }
      ],
      "contactPersonsList": [
        {
          EnquiryMaster_Code: this.newCode == undefined ? this.editCode : this.newCode,
          Code: this.contactPersonCode,
          contactPersonName: this.contactPerson.value.name,
          contactPersonMobile: this.contactPerson.value.contactNo,
          contactPersonEMail: this.contactPerson.value.email,
          contactPersonDesignation: this.contactPerson.value.designation,
          departmentName: this.contactPerson.value.department,
        }
      ]
    }
    this._enquiryService.CheckDuplicateEnquiryContactDetail(Obj).subscribe((res: any) => {
      if (res.Status == "Y") {
        this._contactPersonService.postPersonDetails(Obj).subscribe(res => {
          this.contactPerson.reset();
          this.contactPersonCode = undefined;
          console.log(Obj.contactPersonsList[0]);
          this.contactPersonsList.push(Obj.contactPersonsList[0])
          this.getEnquirByCode();

          if (Obj.contactPersonsList[0].Code) {
            this.snackBarService.showSuccessMessage('Contact person details updated successfully!');
          } else this.snackBarService.showSuccessMessage('Contact person details saved successfully!');
        },
          err => {
            this.snackBarService.showErrorMessage('Failed to save Contact person details');
          })
      } else {
        alert(res.Msg)
      }
    })
  }
  contactPersonUpdate(code: number) {
    this.contactPersonCode = code;
    const enquiryCode = this.newCode == undefined ? this.editCode : this.newCode;

    this._enquiryService.GetEnquiryDetailsByCode(enquiryCode).subscribe(res => {
      this.contactPersonsList = res.ContactPersonsList;
      this.enquiryProductDetails = res.EnquiryDetails;

      // Find the contact person by the provided code
      const selectedPerson = this.contactPersonsList.find(person => person.Code === code);
      if (selectedPerson) {
        this.personDataPopplate(selectedPerson)
      }
      // this.snackBarService.showSuccessMessage('Contact person details updated successfully!');
    },
      err => {
        this.snackBarService.showErrorMessage('Failed to update Contact person details');
      })
  }
  personDataPopplate(person: any) {
    // this.contactPersonsList.forEach((person, index) => {
    //   console.log(`Object ${index + 1}`, person.ContactPersonName);
    // });
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
          this.snackBarService.showSuccessMessage('Customer person details deleted successfully!');
          this.contactPerson.reset();
          this.getEnquirByCode();
        },
          err => {
            this.snackBarService.showErrorMessage('Failed to delete Customer person details');
          });
      }
    }
    );
  }
  onExistingPersonChange(event: any): void {
    const selectedExistingPersonName = event.target.value;
    // this.contactPerson.get('name').setValue(selectedExistingPersonName);
    console.log(selectedExistingPersonName);
    const formValues = {
      name: selectedExistingPersonName,
      department: this.existingPersonNameList[0].DepartmentName,
      designation: this.existingPersonNameList[0].ContactPersonDesignation,
      email: this.existingPersonNameList[0].ContactPersonEMail,
      contactNo: this.existingPersonNameList[0].ContactPersonMobile,
    };
    this.contactPerson.patchValue(formValues);
    console.log("formValues", formValues);
  }

  //product details save, update and delete method
  saveProductDetails() {
    const Obj = {
      "enquiryMaster": [
        {
          code: this.newCode == undefined ? this.editCode : this.newCode,
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
          isAttachmentExists: this.base64String ? "Y" : "N",
          documentName: this.documentType,
          documentContent: this.base64String,
          NextFollowupdate: this.newCustomerForm.value.followupdate,
          NextFollowupmode: this.newCustomerForm.value.followupmode,
          remark: this.newCustomerForm.value.remark,
          "verifiedOn": "",
          "status": "U"
        }
      ],
      "enquiryDetails": [
        {
          EnquiryMaster_Code: this.newCode == undefined ? this.editCode : this.newCode,
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
    this._productDetailsService.postProductDetails(Obj).subscribe(res => {
      this.resetForm();
      this.productDetailsCode = undefined;
      this.getEnquirByCode();
      if (Obj.enquiryDetails[0].Code) {
        this.snackBarService.showSuccessMessage('Product details updated successfully!');
      } else this.snackBarService.showSuccessMessage('Product details saved successfully!');
    },
      err => {
        this.snackBarService.showErrorMessage('Failed to saved Product details');
      })
  }
  productDetailsUpdate(code: number) {
    this.productDetailsCode = code;
    const enquiryCode = this.newCode == undefined ? this.editCode : this.newCode;
    this._enquiryService.GetEnquiryDetailsByCode(enquiryCode).subscribe(res => {
      this.enquiryProductDetails = res.EnquiryDetails;

      // Find the product by the provided code
      const selectedProduct = this.enquiryProductDetails.find(procuct => procuct.Code === code);
      if (selectedProduct) {
        this.poductDataPopplate(selectedProduct)
      }
      // this.snackBarService.showSuccessMessage('Product details updated successfully!');
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
  }
  deleteProductDetails(Code: any): void {
    const dialogRef = this.dialog.open(DeleteConfermationPopUpComponent, {
      width: '375px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const reason = result.reason;
        this._enquiryService.deleteProductDetails(Code, reason).subscribe(() => {
          // console.log(`${Code} has been deleted`);
          this.productDetails.reset();
          this.getEnquirByCode();
          const index = this.dataSource.data.findIndex(item => item.Code === Code);
          if (index > -1) {
            // Remove the row from the data source
            this.dataSource.data.splice(index, 1);
            // Update the MatTableDataSource to reflect the changes
            this.dataSource = new MatTableDataSource(this.dataSource.data);
          }
          this.snackBarService.showSuccessMessage('Product details deleted successfully!');

        },
          err => {
            this.snackBarService.showErrorMessage(' Failed to delete Product details');
          });

      }
    });
  }

  backtotable() {
    this.location.back();
  }
  backtotable1() {
    this.location.back();
  }

  onFileUploadChange(event: any) {
    const file = event.target.files[0];
    if (file && file.size > 100 * 1024) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imageSrc = reader.result as string;
        this.documentType = this.imageSrc.split(',')[0].split(';')[0].split(':')[1];
        this.base64String = this.imageSrc.split(',')[1];

        // Update the form control value
        this.newCustomerForm.patchValue({
          attachment: file
        });
        this.newCustomerForm.get('attachment').setErrors(null);
      };
      reader.readAsDataURL(file);
    } else {
      // Set an error if the file size is less than 2 MB
      this.newCustomerForm.get('attachment').setErrors({ fileSize: true });
    }
    this.setImage();
  }

  // Choose File
  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement>;

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
  // End Choose File

}



export function fileSizeValidator(maxSizeInMB: number): ValidatorFn {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return (control: AbstractControl): { [key: string]: any } | null => {
    const file = control.value;
    if (file && file.size > 0) {
      return file.size > maxSizeInBytes ? null : { fileSize: true };
    }
    return null;
  };
}


export function alphabeticValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const valid = /^[A-Za-z]+$/.test(control.value);
    return valid ? null : { 'alphabetic': { value: control.value } };
  };
}
