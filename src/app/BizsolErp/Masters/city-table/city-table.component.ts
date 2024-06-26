import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControlName, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { AvatarComponent, BadgeComponent, BreadcrumbRouterComponent, ButtonCloseDirective, ButtonDirective, ContainerComponent, DropdownComponent, DropdownDividerDirective, DropdownHeaderDirective, DropdownItemDirective, DropdownMenuDirective, DropdownToggleDirective, FormModule, HeaderNavComponent, HeaderTogglerDirective, ModalBodyComponent, ModalComponent, ModalFooterComponent, ModalHeaderComponent, ModalTitleDirective, NavItemComponent, NavLinkDirective, ProgressBarDirective, ProgressComponent, SidebarToggleDirective, TextColorDirective, ThemeDirective } from '@coreui/angular';
import { CityService } from '../../../services/Master/city.service';
import { StateService } from '../../../services/Master/state.service';
import { CountryService } from '../../../services/Master/country.service';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfermationPopUpComponent } from 'src/app/pop-up/delete-confermation/delete-confermation-pop-up/delete-confermation-pop-up.component';

@Component({
  selector: 'app-city-table',
  standalone: true,
  providers: [StateService, CityService, FormControlName, CountryService],
  templateUrl: './city-table.component.html',
  styleUrl: './city-table.component.scss',
  imports: [CommonModule, HttpClientModule, FormModule, ReactiveFormsModule, MatTableModule, MatPaginatorModule, MatSortModule, MatButtonModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, FormModule, RouterModule, ContainerComponent, HeaderTogglerDirective, SidebarToggleDirective, HeaderNavComponent, NavItemComponent, NavLinkDirective, BreadcrumbRouterComponent, ThemeDirective, DropdownComponent, DropdownToggleDirective, TextColorDirective, AvatarComponent, DropdownMenuDirective,
    DropdownHeaderDirective, DropdownItemDirective, BadgeComponent, DropdownDividerDirective, ProgressBarDirective, ProgressComponent, ButtonDirective, ModalComponent, ModalHeaderComponent, ModalTitleDirective, ThemeDirective, ButtonCloseDirective, ModalBodyComponent, ModalFooterComponent]
})
export class CityTableComponent implements OnInit {

  // @Input() statelist: any[];
  @ViewChild(MatSort) _sorting: MatSort;
  @ViewChild(MatPaginator) _paging: MatPaginator;
  dataSource: MatTableDataSource<any>;

  displayedColumns: string[] = ['SN','CityName', 'Pin','StateName', 'Action'];
  columnDisplayNames: { [key: string]: string } = {
    'SN': 'SN',
    'StateName': 'State Name',
    'CityName': 'City Name',
    'Pin': 'Pin Code',
    'Action': 'Action'
  };
  cityForm !: any;
  countryList: any = [];
  stateList: any = [];
  selectedCountry: any = [];
  selectedState: any;
  cityList: any;
  item: any;
  countryName: any;
  cityName: any;
  public createvisible = false;
  public updatevisible = false;

  constructor(private _stateService: StateService, private _cityService: CityService, private _countryService: CountryService, private fb: FormBuilder, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.setForm();
    this._countryService.getCountry().subscribe(res => {
      this.countryList = res;
    })
    this.getStateList('All')
    this.getCityList('All')
  }
  setForm() {
    this.cityForm = this.fb.group({
      stateName: ['', [Validators.required, Validators.maxLength(20)]],
      cityName: ['', [Validators.required, Validators.maxLength(20)]],
      pinCode: ['', [Validators.required, Validators.maxLength(20)]],
    })
  }
////////////////////////////////////////////////Validation for create city modal//////////////////////////////////////////////////
specialCharacternumberValidator(event: KeyboardEvent) {
  const inputChar = String.fromCharCode(event.charCode);
  const pattern = /[a-zA-Z ]/;

  if (!pattern.test(inputChar)) {
    // If the input character is not an alphabet, prevent it from being entered into the input field
    event.preventDefault();
  }
}
citypincodevalidation(event:KeyboardEvent){
  const inputChar =String.fromCharCode(event.charCode);
  const pattern =/[0-9]/;
  if(!pattern.test(inputChar)){
    event.preventDefault();
  }

}
//////////////////////////////////////////////////////togglers create & Update/////////////////////////////////////////////////////
  createtoggle() {
    this.createvisible = !this.createvisible;
  }
  updatetoggle() {
    this.updatevisible = !this.updatevisible;

  }
  handleLiveDemoChange(event: any) {
   this.createvisible=event;
   this.cityForm.reset();
  }
  handleUpdateChange(event: any) {
    this.updatevisible=event;
    }

  getStateList(country: any) {
    this.countryName = country
    this._stateService.getStatesList(this.countryName).subscribe(res => {
      this.stateList = res
    })
  }

  getCityList(state: any) {
    this.selectedState = state;
    this._cityService.getCityList(state).subscribe(res => {

      this.cityList = res.map((item, index) => ({ SN: index + 1, ...item }));
      this.dataSource = new MatTableDataSource(this.cityList);
      this.dataSource.sort = this._sorting;
      this.dataSource.paginator = this._paging;

      console.log('Data Source:', this.dataSource.data);


    })
  }
  submit() {
    let obj = {
      stateName: this.cityForm.value.stateName,
      cityName: this.cityForm.value.cityName,
      pin: this.cityForm.value.pinCode,
      userMaster_Code: 13,
    }

    console.log("city", obj);

    this._cityService.saveCity(obj).subscribe({
      next: (res: any) => {
        let obj = JSON.stringify(res);
        const responseObj = JSON.parse(JSON.stringify(res));
        alert(responseObj.Msg)
        this.getCityList(this.selectedState)
      },
      error: console.log,
    })
    this.cityForm.reset();
    this.createvisible = false;
  }
  /////////////////////////////////////////////////////////////Update City////////////////////////////////////////////////////////////////////
  editState(item: any) {
    // console.log("unique Code", item.Code);
    if (item.Code) {
      this.cityForm.patchValue({
        stateName: item.StateName,
        cityName: item.CityName,
        pinCode: item.Pin
      });
      this.updatetoggle();
      this.item = item.Code; // Store the item for reference
      console.log("the updated item are :", this.item);
    } else {
      console.error("Item or CountryName is undefined:", item);
    }
  }

  updateSubmit(cityCode: any) {

    const updatedState = this.cityForm.value.stateName;
    const updatedCity = this.cityForm.value.cityName;
    const updatedPincode = this.cityForm.value.pinCode;

    let obj = {
      Code: this.item,
      stateName: updatedState,
      cityName: updatedCity,
      pin: updatedPincode,
      userMaster_Code: 13,
    };
    this._cityService.saveCity(obj).subscribe({
      next: (res: any) => {
        const responseObj = JSON.parse(JSON.stringify(res));
        if (responseObj && responseObj.Msg) {
          alert(responseObj.Msg);
          this.getCityList(this.selectedState);
          this.cityForm.reset();
        }
        this.updatevisible = false;
      },
      error: console.error,
    });
  }

  /////////////////////////////////////////////////////////////Delete City////////////////////////////////////////////////////////////////////

  deleteState(Code: any): void {
    const dialogRef = this.dialog.open(DeleteConfermationPopUpComponent, {
      width: '375px',
      data: { message: 'Are you sure you want to delete this City?', reason: '', code: Code }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.confirmed) {
        const reason = result.reason;
        this._cityService.deleteCity(Code, reason).subscribe((res) => {
          console.log(`${Code} has been deleted`);
          const responseObj = JSON.parse(JSON.stringify(res));
          alert(responseObj.Msg);
          this.getCityList(this.selectedState);
        });
      }
    });
  }
}




