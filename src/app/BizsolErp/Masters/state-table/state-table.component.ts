
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import {
  AvatarComponent,
  BadgeComponent,
  BreadcrumbRouterComponent,
  ButtonCloseDirective,
  ButtonDirective,
  ContainerComponent,
  DropdownComponent,
  DropdownDividerDirective,
  DropdownHeaderDirective,
  DropdownItemDirective,
  DropdownMenuDirective,
  DropdownToggleDirective,
  HeaderNavComponent,
  HeaderTogglerDirective,
  ModalBodyComponent,
  ModalComponent,
  ModalFooterComponent,
  ModalHeaderComponent,
  ModalTitleDirective,
  NavItemComponent,
  NavLinkDirective,
  ProgressBarDirective,
  ProgressComponent,
  SidebarToggleDirective,
  TextColorDirective,
  ThemeDirective
} from '@coreui/angular';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { FormModule } from '@coreui/angular';
import { StateService } from '../../../services/Master/state.service';
import { CountryService } from 'src/app/services/Master/country.service';
import { FormBuilder, FormControlName, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DeleteConfermationPopUpComponent } from 'src/app/pop-up/delete-confermation/delete-confermation-pop-up/delete-confermation-pop-up.component';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { result } from 'lodash-es';
// import { CityTableComponent } from "../city-table/city-table.component";

@Component({
  selector: 'app-state-table',
  standalone: true,
  providers: [CountryService, StateService, FormControlName],
  templateUrl: './state-table.component.html',
  styleUrl: './state-table.component.scss',
  imports: [CommonModule, ReactiveFormsModule, MatError, HttpClientModule, MatTableModule, MatPaginatorModule, MatSortModule, MatButtonModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, FormModule, RouterModule, ContainerComponent, HeaderTogglerDirective, SidebarToggleDirective, HeaderNavComponent, NavItemComponent, NavLinkDirective, BreadcrumbRouterComponent,
    ThemeDirective, DropdownComponent, DropdownToggleDirective, TextColorDirective, AvatarComponent, DropdownMenuDirective, DropdownHeaderDirective, DropdownItemDirective, BadgeComponent, DropdownDividerDirective, ProgressBarDirective,
    ProgressComponent, ButtonDirective, ModalComponent, ModalHeaderComponent, ModalTitleDirective, ThemeDirective, ButtonCloseDirective, ModalBodyComponent, ModalFooterComponent, MatTooltipModule]
})
export class StateTableComponent implements OnInit {
  // selectedCountry: any = '';

  action: string = 'Edit';
  status: string = 'Incomplete';
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['SN', 'StateName', 'StateShortName', 'StateCode','CountryName', 'Action'];
  columnDisplayNames: { [key: string]: string } = {
    'SN': 'SN',
    'CountryName': 'Country Name',
    'StateName': 'State Name',
    'StateShortName': 'State Initial',
    'StateCode': 'State Code',
    'Action': 'Action'
  };

  stateForm!: FormGroup;
  @ViewChild(MatSort) _sorting!: MatSort;
  @ViewChild(MatPaginator) _paging!: MatPaginator;
  countrylist: any = [];
  statelist: any = [];
  selectedcountry:any;
  public createvisible = false;
  public updatevisible = false;
  item: any;
  editdata: Object;
  selectedCountry: string;
  countryName: string;

/////////////////////////////////////////////////////////Toggler function for modal/////////////////////////////////////////////////
  toggleLiveDemo() {
    this.createvisible = !this.createvisible;
    this.stateForm.reset(); 
  }
  toggleUpdate() {
    this.updatevisible = !this.updatevisible;  
  }
  handleCreateChange(event:any){
    this.createvisible = event;
    }
    handleUpdateChange(event: any) {
    this.updatevisible=event;
    
  }

  constructor(private _countryService: CountryService, private _stateService: StateService, private fb: FormBuilder, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.setForm();
    this.getCountryList();
    // this.statelist;
    this.getStateList("All");
  }
  setForm() {
    this.stateForm = this.fb.group({
      countryName: ['', [Validators.required]],
      stateName: ['', [Validators.required]],
      stateInitial: ['', [Validators.required]],
      stateCode: ['', [Validators.required]],
    })
  }
//////////////////////////////////////////////////////Validation for create modal in state///////////////////////////////////////////
/////////////////////////////////State Name////////////////////////////////////
specialCharacternumberValidator(event: KeyboardEvent) {
  const inputChar = String.fromCharCode(event.charCode);
  const pattern = /[a-zA-Z]/;

  if (!pattern.test(inputChar)) {
    // If the input character is not an alphabet, prevent it from being entered into the input field
    event.preventDefault();
  }
}
// stateinitialvalidation(event:KeyboardEvent){
//   const inputChar =String.fromCharCode(event.charCode);
//   const pattern =/[A-Z]/;
//   if(!pattern.test(inputChar)){
//     event.preventDefault();
//   }

// }
stateinitialvalidation(event) {
  const inputChar = String.fromCharCode(event.charCode);
  const pattern = /[a-z]/; 
  if (pattern.test(inputChar)) {
    const uppercaseChar = inputChar.toUpperCase(); // Convert to uppercase
    const inputElement = event.target; // Assuming the event target is the input element
    const currentValue = inputElement.value;
    const selectionStart = inputElement.selectionStart;
    const selectionEnd = inputElement.selectionEnd;
    // Replace the lowercase character with its uppercase equivalent
    const newValue =
      currentValue.substring(0, selectionStart) +
      uppercaseChar +
      currentValue.substring(selectionEnd);
    // Update the input value
    inputElement.value = newValue;
    // Adjust cursor position
    inputElement.selectionStart = inputElement.selectionEnd = selectionStart + 1;
    // Prevent the default action of the event (inserting the lowercase character)
    event.preventDefault();
  }
}

onlynumberinput(event: KeyboardEvent) {
  const inputChar = String.fromCharCode(event.charCode);
  const pattern = /[0-9]/;
  if (!pattern.test(inputChar)) {
    event.preventDefault();
  }

}

  getStateList(country: string) {

    this.selectedcountry=country;
    // console.log(this.selectedcountry);

    this._stateService.getStatesList(country).subscribe((res: any[]) => {
      this.statelist = res.map((item, index) => ({ SN: index + 1, ...item }));
      this.dataSource = new MatTableDataSource(this.statelist);
      this.dataSource.sort = this._sorting;
      this.dataSource.paginator = this._paging;
      // console.log('Data Source:', this.dataSource.data);
    });
  }


  submit() {
    let obj = {
      // code: 0,
      CountryName: this.stateForm.value.countryName,
      StateName: this.stateForm.value.stateName,
      StateCode: this.stateForm.value.stateCode,
      StateShortName: this.stateForm.value.stateInitial,
      userMaster_Code: 13,
    }
    // console.log("state", obj);

    if (obj.StateName === this.statelist.stateName) {
      alert(`Please Check ! Country Name already exists ${obj.StateName}`)
    }
    else {
      this._stateService.saveState(obj).subscribe({
        next: (res: any) => {
          let obj = JSON.stringify(res);
          const responseObj = JSON.parse(JSON.stringify(res));
          if (responseObj.Msg == 'Data saved successfully.') {
            this.toggleLiveDemo();
          }
          alert(responseObj.Msg)
          this.stateForm.reset();
        this.getStateList(this.selectedcountry);
        },
        // error: console.log,
      })
    }


  }
  getCountryList() {
    
    this._countryService.getCountry().subscribe(res => {
      this.countrylist = res


    })
  }


  ///////////////////////////////////////////Delete State///////////////////////////////////////////\

  deleteState(Code: any): void {

    const dialogRef = this.dialog.open(DeleteConfermationPopUpComponent, {
      width: '375px',
      data: { message: 'Are you sure you want to delete this State?', reason: '', code: Code }
    });
    // const countryname = this.countrylist.CountryName;
    // console.log(countryname);
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.confirmed) {
        const reason = result.reason;
        this._stateService.deleteState(Code, reason).subscribe((res) => {
          console.log(`${Code} has been deleted`);

          const responseObj =JSON.parse(JSON.stringify(res));
          alert(responseObj.Msg);
          this.getStateList(this.selectedcountry);
        });
      }
      this.getStateList(this.selectedcountry);
    });
  }
  // //////////////////////////////////////////////////////////Update State/////////////////////////////////
  // public visible = false;

 
  editState(item: any) {
    // console.log("unique Code", item.Code);
    if (item.Code) {
      this.stateForm.patchValue({
        countryName: item.CountryName,
        stateName: item.StateName,
        stateInitial: item.StateShortName,
        stateCode: item.StateCode
      });
      this.toggleUpdate();
      this.item = item.Code; // Store the item for reference
      // console.log("the updated item are :", this.item);
    } else {
      // console.error("Item or CountryName is undefined:", item);
    }
  }

  updateSubmit(stateCode: any) {
    this.createvisible=false;
    const updatedCountry = this.stateForm.value.countryName;
    const updatedState = this.stateForm.value.stateName;
    const updatedInitial = this.stateForm.value.stateInitial;
    const updatedCode = this.stateForm.value.stateCode;

    let obj = {
      code: this.item,
      countryName: updatedCountry,
      stateName: updatedState,
      stateShortName: updatedInitial,
      stateCode: updatedCode,
      userMaster_Code: 13,
    };
    this._stateService.saveState(obj).subscribe({
      // this.editdata = res;
      // console.log(this.editdata);
      next: (res: any) => {
        const responseObj = JSON.parse(JSON.stringify(res));
        if (responseObj && responseObj.Msg) {
          alert(responseObj.Msg);
          this.getStateList(this.selectedcountry);
          this.stateForm.reset();
        }
       
        this.updatevisible = false;
        

      },
      // error: console.error,


    });
  }





}





