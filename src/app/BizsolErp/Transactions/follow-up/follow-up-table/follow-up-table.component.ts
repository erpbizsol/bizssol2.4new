import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, Component, ViewChild } from '@angular/core';
import { FormControl, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FollowUpService } from 'src/app/services/Transaction/follow-up.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DeleteConfermationPopUpComponent } from 'src/app/pop-up/delete-confermation/delete-confermation-pop-up/delete-confermation-pop-up.component';
import { ToasterService } from 'src/app/services/toaster-message/toaster.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-follow-up-table',
  standalone: true,
  imports: [
    CommonModule, 
    HttpClientModule, 
    MatTableModule, 
    MatPaginatorModule, 
    MatSortModule, 
    MatButtonModule, 
    MatInputModule, 
    MatTooltipModule,
    MatFormFieldModule, 
    MatSelectModule, 
    FormsModule, 
    RouterModule,
    MatIconModule
  ],
  providers: [FollowUpService, DatePipe, ToasterService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './follow-up-table.component.html',
  styleUrls: ['./follow-up-table.component.scss']
})
export class FollowUpTableComponent {
  isDataAvailable: boolean = false;
  dataSource: MatTableDataSource<any>;
  remarksControl = new FormControl('');
  displayedColumns: string[] = [
    'SN',
    'FollowupDate',
    'NextFollowupDate',
    'FollowupMode',
    'OverdueFollowupDays',
    'OurRemarks',
    'CustomerRemarks',
    'Action'
  ];

  columnDisplayNames: { [key: string]: string } = {
    'SN': 'SN',
    'FollowupDate': 'Follow-up Dt',
    'NextFollowupDate': 'Nxt Follow-up Dt',
    'FollowupMode': 'Follow-up Mode',
    'OverdueFollowupDays': 'Overdue days',
    'OurRemarks': 'Our Remarks',
    'CustomerRemarks': 'Cust Remarks' ,
    'Action': 'Action'
  };

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  followUpEnquryList: any = [];
  showFollowUpTable: boolean = true;
  showFollowUpViewTable: boolean = true;
  showEditFollowUp: boolean = false;
  showNewFollowUp: boolean = false;
  enquiryMasterCode: any;
  code: any;
  selectedRowData: any;
  selectedRow: any;
  EnquiryNo: any;
  EnquiryDate: any;
  CompanyName: any;
  previousSelectedData: any;
  filters: { [key: string]: any } = {};

  constructor(
    private followUpService: FollowUpService, 
    private router: Router, 
    private route: ActivatedRoute, 
    private dialog: MatDialog, 
    private datePipe: DatePipe, 
    private toasterService: ToasterService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.code = params['code'];
    });
    this.getEnquiryFollowUpList();
  }

  getEnquiryFollowUpList() {
    this.followUpService.getEnquiryFollowUpList(this.code).subscribe((res: any[]) => {
      if (res && res.length > 0) {
        const firstItem = res[0];
        this.EnquiryNo = firstItem.EnquiryNo;
        this.EnquiryDate = this.datePipe.transform(firstItem.EnquiryDate, 'dd/MM/yyyy');
        this.CompanyName = firstItem.CompanyName;
      }
      this.followUpEnquryList = res.map((item, index) => ({ SN: index + 1, editable: false, ...item }));
      this.dataSource = new MatTableDataSource(this.followUpEnquryList);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;

      this.initializeFilters();
    },
    err => {
      this.toasterService.showError(err.Msg);
    });
  }

  initializeFilters() {
    this.displayedColumns.forEach(column => {
      if (column !== 'SN' && column !== 'Action') {
        this.filters[column] = this.getColumnValues(column).reduce((acc, value) => {
          acc[value] = false;
          return acc;
        }, {});
      }
    });
  }

  applyFilter(column: string, value: string) {
    if (value === 'All') {
      // Select all options for this column
      Object.keys(this.filters[column]).forEach(option => {
        this.filters[column][option] = true;
      });
    } else {
      // Clear previous filters
      Object.keys(this.filters).forEach(key => {
        if (key !== column) {
          Object.keys(this.filters[key]).forEach(option => {
            this.filters[key][option] = false;
          });
        }
      });
  
      // Apply current filter
      this.filters[column][value] = !this.filters[column][value];
    }
    this.applyFilters();
  }
  
  areAllOptionsSelected(column: string): boolean {
    const columnFilters = this.filters[column];
    return Object.keys(columnFilters).every(option => columnFilters[option]);
  }

  applyFilters() {
    this.dataSource.filterPredicate = (data, filter) => {
      const searchTerms = JSON.parse(filter);
      return Object.keys(searchTerms).every(key => {
        const selectedFilters = searchTerms[key];
        if (Object.values(selectedFilters).every(val => !val)) {
          return true;
        }
        return selectedFilters[data[key]];
      });
    };
    this.dataSource.filter = JSON.stringify(this.filters);
  }

  getColumnValues(column: string): any[] {
    const values = this.followUpEnquryList.map(item => item[column]);
    const uniqueValues = [...new Set(values)];
    return [ ...uniqueValues]; // Add 'All' option at the beginning
  }

  deleteFollowUp(Code: any): void {
    const dialogRef = this.dialog.open(DeleteConfermationPopUpComponent, {
      data: { reason: '', code: Code }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.confirmed) {
        const reason = result.reason;
        this.followUpService.deleteFollowup(Code, reason).subscribe((res: any) => {
          this.toasterService.showSuccess(res.Msg);
          this.dataSource.data = this.dataSource.data.filter(item => item.Code !== Code);
        },
        err => {
          this.toasterService.showError('Failed to delete Follow Up');
        });
      }
    });
  }

  editFollowUp(code: any) {
    this.router.navigate(['/transactions/editfollowup', code]);
  }

  viewFollowUp(code: string) {
    this.router.navigate(['/transactions/followup-view', code]);
  }

  openNewFollowUp() {
    this.getCustomerNameAndNextFollowupCode().subscribe(data => {
      this.previousSelectedData = data;
      this.router.navigate(['/transactions/newfollowup'], { 
        queryParams: { 
          EnquiryMaster_Code: this.code, 
          isDataAvailable: this.isDataAvailable, 
          lastcreatedData: JSON.stringify(this.previousSelectedData) 
        } 
      });
    });
  }

  getCustomerNameAndNextFollowupCode() {
    return this.followUpService.getCustomerNameAndFollowUpMode(this.code);
  }
}
