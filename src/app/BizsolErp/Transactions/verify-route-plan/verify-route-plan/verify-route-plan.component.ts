import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { DeleteConfermationPopUpComponent } from 'src/app/pop-up/delete-confermation/delete-confermation-pop-up/delete-confermation-pop-up.component';
import { RoutePlanService } from 'src/app/services/Master/route-plan.service';
import { SnackBarService } from '../../../../services/SnakBar-Service/snack-bar.service';

@Component({
  selector: 'app-verify-route-plan',
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
    ReactiveFormsModule,
    RouterModule
  ],
  providers: [RoutePlanService, DatePipe, SnackBarService],
  templateUrl: './verify-route-plan.component.html',
  styleUrl: './verify-route-plan.component.scss'
})
export class VerifyRoutePlanComponent {
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = [
    'SN',
    'Date',
    'Username',
    'VisitType',
    'AccountDesp',
    'CityName',
    'StateName',
    'Description',
    'IsVerify',
    'Action'
  ];

  columnDisplayNames: { [key: string]: string } = {
    'SN': 'SN',
    'Date': 'Date',
    'UserName': 'User Name',
    'VisitType': 'Visit-type',
    'AccountDesp': 'Dealer Name',
    'CityName': 'City',
    'StateName': 'State',
    'Description': 'Description',
    'IsVerify': 'Status',
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
  verifyRoutePlanList: any[];
  // searchControl: FormControl = new FormControl();
  selectedCity: string = '';
  selectedUser: string = '';
  searchTerm: string = '';
  constructor(
    private routePlanService: RoutePlanService, 
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
    this.getVerifyRoutePlanList();
  }


  getVerifyRoutePlanList() {
    this.routePlanService.getRoutePlanMasterList().subscribe((res: any[]) => {
      this.verifyRoutePlanList = res.map((item, index) => ({ SN: index + 1, ...item }));
      this.dataSource = new MatTableDataSource(this.verifyRoutePlanList);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.dataSource.filterPredicate = (data: any, filter: string) => {
        const searchTerms = JSON.parse(filter);
        const usernameFilter = searchTerms.username.toLowerCase();
        const cityFilter = searchTerms.city.toLowerCase();
        const matchesUsername = usernameFilter === 'all' || data.UserName.toLowerCase().includes(usernameFilter);
        const matchesCity = cityFilter === 'all' || data.CityName.toLowerCase().includes(cityFilter);

        return matchesUsername && matchesCity;
      };
    },
      err => {
        this.snackBarService.showErrorMessage('Failed to fetch Follow-Up data');
      });
  }

  // Copy code
  searchFilterPredicate(data: any, filter: string): boolean {
    const columns = Object.keys(data);
    const filterValue = filter.trim().toLowerCase();
    return columns.some(column => {
      return data[column] && data[column].toString().toLowerCase().includes(filterValue);
    });
  }
  
  dropdownFilterPredicate(data: any, filter: any): boolean {
    const usernameFilter = filter.username.toLowerCase();
    const cityFilter = filter.city.toLowerCase();
    const matchesUsername = usernameFilter === 'all' || data.UserName.toLowerCase().includes(usernameFilter);
    const matchesCity = cityFilter === 'all' || data.CityName.toLowerCase().includes(cityFilter);
    return matchesUsername && matchesCity;
  }
  
  applyFilter(): void {
    const searchFilterValue = this.searchTerm.trim().toLowerCase();
    const dropdownFilterValue = {
      username: this.selectedUser || 'ALL',
      city: this.selectedCity || 'ALL'
    };
  
    this.dataSource.filter = JSON.stringify(dropdownFilterValue); // Apply dropdown filter first
    this.dataSource.filterPredicate = (data, filter) => {
      const dropdownFilter = JSON.parse(filter);
      return this.dropdownFilterPredicate(data, dropdownFilter) && this.searchFilterPredicate(data, searchFilterValue);
    };
  }
  
  applySearchFilter(): void {
    const filterValue = this.searchTerm.trim().toLowerCase();
    this.dataSource.filterPredicate = (data, filter) => this.searchFilterPredicate(data, filterValue);
    this.dataSource.filter = filterValue;
     // Reset dropdown filters to "ALL" when search is initiated
  this.selectedUser = 'ALL';
  this.selectedCity = 'ALL';
  this.applyFilter(); // Apply the filter with the new values
  }
  applyUserFilter(event: MatSelectChange) {
    this.selectedUser = event.value === 'ALL' ? '' : event.value.trim().toLowerCase();
    this.applyFilter();
  }

  applyCityFilter(event: MatSelectChange) {
    this.selectedCity = event.value === 'ALL' ? '' : event.value.trim().toLowerCase();
    this.applyFilter();
  }
  
  deleteFollowUp(Code: any): void {
    
  }
  
  verify(code: any) {
    this.routePlanService.verifyRoutePlan(code).subscribe(() =>{
      this.snackBarService.showSuccessMessage('Route Plan verified successfully!');
      this.getVerifyRoutePlanList(); // Refresh the table
    },
    err => {
      this.snackBarService.showErrorMessage('Failed to verify Route Plan');
    })
  }
  
  verifyAllRoutePlan() {
    const allCodes = this.verifyRoutePlanList.map(plan => plan.Code);
    this.routePlanService.verifyAllRoutePlan(allCodes).subscribe(() => {
      this.snackBarService.showSuccessMessage('All Route Plans verified successfully!');
      this.getVerifyRoutePlanList(); 
    }, err => {
      this.snackBarService.showErrorMessage('Failed to verify all Route Plans');
    });
  }

  rejectRoutePlan(Code: any): void {
    const dialogRef = this.dialog.open(DeleteConfermationPopUpComponent, {
      data: { reason: '', code: Code }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.confirmed) {
        const reason = result.reason;
        this.routePlanService.rejectRoutePlan(Code, reason).subscribe(() => {
          this.snackBarService.showSuccessMessage('Route plan deleted successfully!');
          },
          err => {
            this.snackBarService.showErrorMessage('Failed to delete Route plan');
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
  
  rejectAllRoutePlan(): void {
    const dialogRef = this.dialog.open(DeleteConfermationPopUpComponent, {
      data: { reason: '', code: null } 
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.confirmed) {
        const reason = result.reason;
        const allCodes = this.verifyRoutePlanList.map(plan => plan.Code);
        
        this.routePlanService.rejectAllRoutePlan(allCodes, reason).subscribe(() => {
          this.snackBarService.showSuccessMessage('All Route plans deleted successfully!');
          this.getVerifyRoutePlanList();
        }, err => {
          this.snackBarService.showErrorMessage('Failed to delete all Route plans');
        });
      }
    });
  }
  
}
