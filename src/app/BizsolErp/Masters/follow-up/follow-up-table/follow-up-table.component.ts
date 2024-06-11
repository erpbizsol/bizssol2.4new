import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { FormControl, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FollowUpService } from 'src/app/services/Master/follow-up.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DeleteConfermationPopUpComponent } from 'src/app/pop-up/delete-confermation/delete-confermation-pop-up/delete-confermation-pop-up.component';
import { NewFollowUpComponent } from '../new-follow-up/new-follow-up.component';
import { EditFollowUpComponent } from '../edit-follow-up/edit-follow-up.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarService } from 'src/app/services/SnakBar-Service/snack-bar.service';

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
    RouterModule
  ],
  providers: [FollowUpService, DatePipe, SnackBarService],
  templateUrl: './follow-up-table.component.html',
  styleUrl: './follow-up-table.component.scss'
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

  constructor(
    private followUpService: FollowUpService, 
    private router: Router, 
    private route: ActivatedRoute, 
    private dialog: MatDialog, 
    private datePipe: DatePipe, 
    private snackBarService: SnackBarService
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

     // Check if no data is returned and open the new follow-up page
     if (this.isDataAvailable = this.dataSource.data && this.dataSource.data.length === 0) {
      this.openNewFollowUp();
    }
    },
    err => {
      this.snackBarService.showErrorMessage('Failed to fetch Follow-Up data');
    });
  }

  addNewRow(): void {
    const newRow = {
      SN: this.dataSource.data.length + 1,
    };
    this.dataSource.data.push(newRow);
    this.dataSource = new MatTableDataSource(this.dataSource.data);
  }

  deleteRow(row: any): void {
    const index = this.dataSource.data.indexOf(row);
    if (index > -1) {
      this.dataSource.data.splice(index, 1);
      this.dataSource = new MatTableDataSource(this.dataSource.data);
    }
  }


  deleteFollowUp(Code: any): void {
    const dialogRef = this.dialog.open(DeleteConfermationPopUpComponent, {
      data: { reason: '', code: Code }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.confirmed) {
        const reason = result.reason;
        this.followUpService.deleteFollowup(Code, reason).subscribe(() => {
          this.snackBarService.showSuccessMessage('Follow Up deleted successfully!');
          },
          err => {
            this.snackBarService.showErrorMessage('Failed to delete Follow Up');
          }
        );
      
                const index = this.dataSource.data.findIndex(item => item.Code === Code);
          if (index > -1) {
            this.dataSource.data.splice(index, 1);
            this.dataSource = new MatTableDataSource(this.dataSource.data);
          }
        }    
    });
  }
  
  editFollowUp(code: any) {
    this.router.navigate(['/leads/editfollowup', code]);
  }
  viewFollowUp(code: string) {
    this.router.navigate(['/leads/followup-view', code])
  }
  openNewFollowUp() {
    this.getCustomerNameAndNextFollowupCode().subscribe(data => {
      this.previousSelectedData = data;
      this.router.navigate(['/leads/newfollowup'], { 
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
