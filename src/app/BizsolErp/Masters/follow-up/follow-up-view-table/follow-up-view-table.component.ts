import { CommonModule, Location } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ContainerComponent, HeaderTogglerDirective, SidebarToggleDirective, HeaderNavComponent, NavItemComponent, NavLinkDirective, BreadcrumbRouterComponent, ThemeDirective, DropdownComponent, DropdownToggleDirective, TextColorDirective, AvatarComponent } from '@coreui/angular';
import { FollowUpService } from 'src/app/services/Master/follow-up.service';
import { NewFollowUpComponent } from '../new-follow-up/new-follow-up.component';
import { SnackBarService } from 'src/app/services/SnakBar-Service/snack-bar.service';

@Component({
  selector: 'app-follow-up-view-table',
  standalone: true,
  imports: [CommonModule, HttpClientModule, MatTableModule, MatPaginatorModule, MatSortModule, MatButtonModule,MatInputModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, FormsModule, RouterModule, ContainerComponent, HeaderTogglerDirective, SidebarToggleDirective, HeaderNavComponent, NavItemComponent, NavLinkDirective, BreadcrumbRouterComponent, ThemeDirective, DropdownComponent, DropdownToggleDirective, TextColorDirective, AvatarComponent, NewFollowUpComponent],
  providers: [FollowUpService],  templateUrl: './follow-up-view-table.component.html',
  styleUrl: './follow-up-view-table.component.scss'
})
export class FollowUpViewTableComponent {
  code: any;
  selectedRowData: any;

  constructor(private followUpService: FollowUpService, private router: Router, private route: ActivatedRoute, private location: Location, private snackBarService: SnackBarService) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.code = params['code']; 
    });
    this.getEnquiryFollowUpByCode();
  }
 
  getEnquiryFollowUpByCode() {
    this.followUpService.followupDetailsByCode(this.code).subscribe((res: any[]) => {
      this.selectedRowData = res;},
      err => {
        this.snackBarService.showErrorMessage('Failed to fetch Follow-Up view data');
      });
  }
  Cancel(){
    this.location.back();
  }
}
