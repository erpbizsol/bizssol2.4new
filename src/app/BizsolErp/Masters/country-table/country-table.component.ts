import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CountryService } from "../../../services/Master/country.service";
import { HttpClientModule } from "@angular/common/http"
import { ButtonCloseDirective, ButtonDirective, FormModule, ModalBodyComponent, ModalComponent, ModalFooterComponent, ModalHeaderComponent, ModalTitleDirective, PageItemDirective, PageLinkDirective, PaginationComponent, ThemeDirective } from '@coreui/angular';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
// import { NgxPaginationModule } from 'ngx-pagination';
import { RouterLink } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatError } from '@angular/material/form-field';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfermationPopUpComponent } from 'src/app/pop-up/delete-confermation/delete-confermation-pop-up/delete-confermation-pop-up.component';


@Component({
  selector: 'app-country-table',
  standalone: true,
  imports: [MatTableModule, HttpClientModule, MatPaginatorModule, ButtonDirective, FormModule, ReactiveFormsModule, MatPaginatorModule, CommonModule, ButtonDirective, ModalComponent,
    ModalHeaderComponent, ModalTitleDirective, ThemeDirective, ButtonCloseDirective, ModalBodyComponent, ModalFooterComponent, PaginationComponent,
    PageItemDirective,
    PageLinkDirective,
    RouterLink, MatError],
  providers: [CountryService],
  templateUrl: './country-table.component.html',
  styleUrl: './country-table.component.scss'
})
export class CountryTableComponent {



  // displayedColumns: string[] = ['sn', 'countryname',];
  dataSource: MatTableDataSource<any>;

  countryForm !: FormGroup;

  @ViewChild(MatSort) _sorting: MatSort;
  @ViewChild(MatPaginator) _paging: MatPaginator;


  public updatevisible = false;
  public visible = false;

  selectedCountryCode: any;

  countrylist: any = [];
  currentPage: number = 1;
  itemsPerPage: number = 8; // Change this value according to your requirement
  item: any;
  editdata: Object;

  // Function to handle pagination
  handlePageChange(action: string) {
    if (action === 'next') {
      this.currentPage++;
    } else if (action === 'prev' && this.currentPage > 1) {
      this.currentPage--;
    }
  }


  constructor(private fb: FormBuilder, private _countryService: CountryService, private dialog: MatDialog) {

  }
  ngOnInit(): void {
    this.setForm();
    this.getCountryList();
  }
  setForm() {
    this.countryForm = this.fb.group({
      countryname: ['', [Validators.required, Validators.maxLength(3)]],
      countrycode: ['', [Validators.required, Validators.maxLength(3)]],
    })
  }
  ////////////////////////////////////////////////Validation for create country modal//////////////////////////////////////////////////
  specialCharacternumberValidator(event: KeyboardEvent) {
    const inputChar = String.fromCharCode(event.charCode);
    const pattern = /[a-zA-Z ]/;
    if (!pattern.test(inputChar)) {
      // If the input character is not an alphabet, prevent it from being entered into the input field
      event.preventDefault();
    }
  }





  onlynumberinput(event: KeyboardEvent) {
    const inputElement = event.target as HTMLInputElement; // Typecast event.target to HTMLInputElement
    const inputChar = String.fromCharCode(event.charCode);

    // Allow digits (0-9) and a single '+' at the beginning
    if (!(event.key >= '0' && event.key <= '9') && !(inputChar === '+' && inputElement.value === '')) {
      event.preventDefault();
    }
  }



  /////////////////////////////////////////////////    ReadCountry///////////////////////////////////////////////////////

  getCountryList() {
    this._countryService.getCountry().subscribe(res => {
      this.countrylist = res;
      console.log(this.countrylist);

    })
  }
  //////////////////////////////////////////////////// CreateCountry///////////////////////////////////////////////////////

  createcountrytoggle() {
    this.visible = !this.visible;

  }
  Updatetoggle() {
    this.updatevisible = !this.updatevisible;
    this.countryForm.reset();
  }


  handleLiveDemoChange(event: any) {
    this.visible = event;
    // this.countryForm.reset();
  }
  handleLiveupdateChange(event: any) {
    this.updatevisible = event;
  }

  submit() {
    console.log(this.countryForm.value);
    if (this.countryForm.get('countryname').value === null || this.countryForm.get('countryname').value === '') {
      alert('Please enter a country name.');
      // return;
    } else
     {
      let obj = {
        CountryName: this.countryForm.value.countryname,
        CountryCode: this.countryForm.value.countrycode,
        userMaster_Code: 141,
      };
      if (this.countrylist.some((item: any) => item.countryName === obj.CountryName)) {
        alert(`Please Check! Country Name already exists: ${obj.CountryName}`);
        // return;
      }
      else {
        this._countryService.saveCountry(obj).subscribe({
          next: (res: any) => {
            const responseObj = JSON.parse(JSON.stringify(res));
            alert(responseObj.Msg);
            this.countryForm.reset();
            this.getCountryList();
          },
          error: console.error,
        });
      }

    }


  }





  //////////////////////////////////////////////////// Update Country///////////////////////////////////////////////////////


  editCountry(item: any) {
    this.selectedCountryCode = item.Code;

    this.updatevisible = true;
    this.visible = false;
    this.countryForm.patchValue({
      countryname: item.CountryName,
      countrycode: item.CountryCode
    });
    // this.countryForm.reset();
  }

  updateSubmit() {


    const updatedValue = this.countryForm.value.countryname;
    const countrycode = this.countryForm.value.countrycode;
    // const code=this.selectedCountryCode.Code

    let obj = {
      Code: this.selectedCountryCode,
      countryName: updatedValue,
      countryCode: countrycode,
      userMaster_Code: 141,
    };

    if (this.countryForm.get('countryname').value === null || this.countryForm.get('countryname').value === '') {
      alert('Please enter a country name.');
      return;
    }
    else if (this.countryForm.get('countrycode').value === null || this.countryForm.get('countrycode').value === '') {
      alert('Please enter a country code.');
      return;
    }



    this._countryService.saveCountry(obj).subscribe({
      next: (res: any) => {
        const responseObj = JSON.parse(JSON.stringify(res));
        if (responseObj && responseObj.Msg) {

          alert(responseObj.Msg);
          this.getCountryList();
          this.countryForm.reset();

        }
        this.updatevisible = false;


      },
      error: console.error,
    });
  }






  //////////////////////////////////////////////////// Delete Country///////////////////////////////////////////////////////

  deleteData(Code: any): void {
    const dialogRef = this.dialog.open(DeleteConfermationPopUpComponent, {
      width: '375px',
      data: { message: 'Are you sure you want to delete this followUp?', reason: '', code: Code }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.confirmed) {
        const reason = result.reason;
        this._countryService.deleteCountry(Code, reason).subscribe((res) => {

          console.log(`${Code} has been deleted`);
          const responseObj = JSON.parse(JSON.stringify(res));
          alert(responseObj.Msg);
          this.getCountryList();
        });
      }
    });
  }







}
