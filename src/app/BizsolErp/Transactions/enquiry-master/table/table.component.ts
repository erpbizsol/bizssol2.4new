import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {
  AvatarComponent,
  BadgeComponent,
  BreadcrumbRouterComponent,
  ColorModeService,
  ContainerComponent,
  DropdownComponent,
  DropdownDividerDirective,
  DropdownHeaderDirective,
  DropdownItemDirective,
  DropdownMenuDirective,
  DropdownToggleDirective,
  HeaderComponent,
  HeaderNavComponent,
  HeaderTogglerDirective,
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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { EnquiryService } from 'src/app/services/Transaction/enquiry.service';
// import { DilogBoxComponent } from '../../../../../core/dilog-box/dilog-box.component';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { DeleteConfermationPopUpComponent } from 'src/app/pop-up/delete-confermation/delete-confermation-pop-up/delete-confermation-pop-up.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarService } from 'src/app/services/SnakBar-Service/snack-bar.service';
import { UrlService } from 'src/app/services/URL/url.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { map, Observable, ReplaySubject, startWith, Subject, takeUntil } from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule,MatSelectModule,NgxMatSelectSearchModule, MatTooltipModule, HttpClientModule, MatTableModule, MatPaginatorModule, MatSortModule, MatButtonModule,
    MatFormFieldModule,MatAutocompleteModule,MatInputModule,  FormsModule, ReactiveFormsModule, RouterModule, ContainerComponent, HeaderTogglerDirective, SidebarToggleDirective, HeaderNavComponent, NavItemComponent, NavLinkDirective, BreadcrumbRouterComponent, ThemeDirective, DropdownComponent, DropdownToggleDirective, TextColorDirective, AvatarComponent, DropdownMenuDirective, DropdownHeaderDirective, DropdownItemDirective, BadgeComponent, DropdownDividerDirective, ProgressBarDirective, ProgressComponent],

  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
  providers: [EnquiryService, SnackBarService, UrlService]
})
export class TableComponent implements OnInit {
  assignPerson: string = '';
  PersonCode: number;

  selectedStatus: string | null = null;
  assignModalRow: any;
  EnquryList: any[] = [];
  StatusList: any[];
  dataSource: MatTableDataSource<any>;
  salesPersonList: any = [];
  remarksControl = new FormControl('');

  action: string = 'Edit';
  status: string = 'Incomplete';

  displayedColumns: string[] = ['SN', 'EnquiryNo', 'AccountDesp', 'EnquiryDate', 'State', 'City', 'NextFollowupdate', 'PersonName', 'Status', 'Verified', 'Action'];
  columnDisplayNames: { [key: string]: string } = {
    'SN': 'S.N.',
    'EnquiryNo': 'Enquiry No.',
    'AccountDesp': 'Company Name',
    'EnquiryDate': 'Lead Date',
    // 'Nation': 'Country',
    'State': 'State',
    'City': 'City',
    'NextFollowupdate': 'Next Follow-Up',
    'PersonName': 'Sales Person',
    'Status': 'Status',
    'Verified': 'Verified',
    'Action': 'Action',
  };

  @ViewChild(MatSort) _sorting: MatSort;
  @ViewChild(MatPaginator) _paging: MatPaginator;
  @ViewChild('myModalVerify') myModalVerify: ElementRef;
  @ViewChild('myModalClose') myModalClose: ElementRef;
  @ViewChild('myModalApproval') myModalApproval: ElementRef;
  @ViewChild('myModalReopen') myModalReopen: ElementRef;

  selectedRow: any;
  closeAppear: boolean = true;
  selected: string = 'S';
  hideApproval: boolean = true;
  newSales: any;

  closeRemark = new FormControl('');
  remarkApproval = new FormControl('');
  reopenRemark = new FormControl('');
  approvalForm: FormGroup;

  constructor(private _enquiryService: EnquiryService, private _urlService: UrlService, private fb: FormBuilder, private router: Router, public _dialog: MatDialog, private _http: HttpClient, private snackBarService: SnackBarService) {
    this.approvalForm = this.fb.group({
      approve: [''],
      remarks: ['']
    });
  }

  ngOnInit(): void {
    // this.getStatus().subscribe((res: any) => {
    //   this.StatusList = res;
    // })  
    this.getStatusList();
    this.getSalePerson();
    this.enquiryList("ALL");

    // this.dataSource.filterPredicate = (data: any, filter: string) => {
    //   return data.status.toLowerCase().includes(filter);
    // };
  }

  satisfiedVlaue() {
    this.selected = 'S';
  }
  unsatisfiedVlaue() {
    this.selected = 'U';
  }
  openAssignModal(row: any) {
    this.selectedRow = row; // Store the selected row
    this.assignPerson = this.selectedRow.PersonName;
    this.btnAppearAcc2Status()
  }

  btnAppearAcc2Status() {
    if (this.selectedRow.Status == "Closed") {
      this.closeAppear = false
    } else this.closeAppear = true

    if (this.selectedRow.Status == "Approved(Satisfied)" || this.selectedRow.Status == "Approved(Unsatisfied)") {
      this.closeAppear = false
      this.hideApproval = false
    } else {
      // this.closeAppear = true
      this.hideApproval = true
    }
  }

  enquiryList(val: string) {
    this._enquiryService.getEnquiry(val).subscribe((res: any[]) => {
      this.EnquryList = res.map((item, index) => ({ SN: index + 1, editable: false, ...item }));
      this.dataSource = new MatTableDataSource(this.EnquryList);
      console.log('dataSource', this.dataSource.filteredData);
      this.dataSource.sort = this._sorting;
      this.dataSource.paginator = this._paging;
      // console.log('EnquryList', this.dataSource.data);

      // Clear or reset selectedStatus
      this.selectedStatus = null; // or set to a default value if needed
      this.applyFilter(''); // Clear current filter
      this.remarksControl.reset();
    },
      err => {
        this.snackBarService.showErrorMessage('Failed to fetch Enquiry-List');
      });

  }
  onStatusChange(status: string): void {
    this.selectedStatus = status;
    this.applyFilter(status);
  }
  applyFilter(filterValue: string) {
    if (this.selectedStatus == 'ALL') {
      this.dataSource.filter = '';
    }
    else {
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
  }

  getStatusList() {
    const data = {
      "tableName": "Vw_WebAPI_EnquiryMaster",
      "fieldName": "[dbo].[UDF_WebAPI_GetStatusFromEnquiry]([Vw_WebAPI_EnquiryMaster].Code)",
      "fieldNameOrderBy": "",
      "distinct": "Y",
      "filterCondition": "group by [dbo].[UDF_WebAPI_GetStatusFromEnquiry]([Vw_WebAPI_EnquiryMaster].Code)"
    }
    return this._http.post(this._urlService.API_ENDPOINT_DROPDOWND, data).subscribe((res: any) => {
      this.StatusList = res;
    })
  }

  deleteLead(code: any): void {
    const openDialog = this._dialog.open(DeleteConfermationPopUpComponent, {
      width: '375px',
      data: {
        message: `Are you sure you want to delete ${code}?`
      }
    });
    openDialog.afterClosed().subscribe(result => {
      if (result && result.confirmed) {
        const reason = result.reason;
        this._enquiryService.deleteEnquiry(code, reason).subscribe(() => {
          this.snackBarService.showSuccessMessage('Enquiry deleted successfully!');
          this.enquiryList("ALL");
        },
          err => {
            this.snackBarService.showErrorMessage('Failed to delete Enquiry');
          });
      }
      // this.snackBarService.showErrorMessage('Failed to delete Enquiry');
    });
  }

  getSalePerson() {
    this._enquiryService.salePerson().subscribe(res => {
      this.salesPersonList = res;
    });
  }

  enquiryVerify(code: any) {
    this._enquiryService.verifyDetails(code, this.remarksControl.value).subscribe(res => {
      this.closeModal();
      this.enquiryList("ALL");
      this.remarksControl.reset();
    });
  }
  enquiryRejected(code: any) {
    this._enquiryService.rejectDetails(code, this.remarksControl.value).subscribe(res => {
      this.closeModal();
      this.enquiryList("ALL");
      this.remarksControl.reset();
    });
  }
  getAssign(code: any) {
    this._enquiryService.assignDetails(code, this.PersonCode).subscribe(res => {
      this.closeModal();
      this.enquiryList("ALL");
    });
  }
  onPersonChange(event: any): void {
    const value = event.target.value;
    const personData = this.salesPersonList.find(data => data.PersonName === value);
    console.log("selectedSalesMan", personData.Code);
    if (personData.Code) {
      this.PersonCode = personData.Code;
      // this.assignPerson.patchValue({ assignPerson: this.salesPersonList.PersonName });
    }
  }
  openFollowUp(code: string): void {
    this.router.navigate(['/leads/followup', code]);
  }

  EnquiryClosed(code: any) {
    const modal = this.myModalClose.nativeElement;
    modal.classList.remove('show');
    modal.style.display = 'none';
    document.body.classList.remove('modal-open');
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) {
      backdrop.remove();
    }

    this._enquiryService.enquiryClosed(code, this.closeRemark.value).subscribe(res => {
      this.enquiryList("ALL");
      this.closeRemark.reset();
    });
  }

  EnquiryApproved(code: any) {
    console.log("this.selected", this.selected);
    // this.approvalForm.value.approve,
    this._enquiryService.enquiryApproved(code, this.remarkApproval.value, this.selected).subscribe(res => {
      const modal = this.myModalApproval.nativeElement;
      modal.classList.remove('show');
      modal.style.display = 'none';
      document.body.classList.remove('modal-open');
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        backdrop.remove();
      }

      this.enquiryList("ALL");
      this.remarkApproval.reset();
      this.selected = 'S';

    });
  }

  EnquiryReOpen(code: any) {
    this._enquiryService.enquiryReOpen(code, this.reopenRemark.value).subscribe(res => {
      const modal = this.myModalReopen.nativeElement;
      modal.classList.remove('show');
      modal.style.display = 'none';
      document.body.classList.remove('modal-open');
      const backdrop = document.querySelector('.modal-backdrop');
      backdrop.remove();

      this.enquiryList("ALL");
      this.reopenRemark.reset();
    });
  }

  closeModal() {
    const modal = this.myModalVerify.nativeElement;
    modal.classList.remove('show');
    modal.style.display = 'none';
    document.body.classList.remove('modal-open');
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) {
      backdrop.remove();
    }
  }

}