import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCalendarCellClassFunction, MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { VisitMasterService } from 'src/app/services/Transaction/visit-master.service';
import { EnquiryService } from 'src/app/services/Transaction/enquiry.service';
import { ToasterService } from 'src/app/services/toaster-message/toaster.service';

@Component({
  selector: 'app-visit-master',
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
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    RouterModule,
    MatRippleModule
  ],
  providers: [VisitMasterService, DatePipe, EnquiryService, ToasterService],
  templateUrl: './visit-master.component.html',
  styleUrls: ['./visit-master.component.scss']
})
export class VisitMasterComponent implements OnInit {
  visitForm: FormGroup;
  displayedColumns: string[] = ['Date', 'UserName', 'VisitType', 'AccountDesp', 'CityName', 'StateName', 'Description', 'TotalOrderQty', 'TotalAmount', 'ButtonStatus'];
  dataSource = new MatTableDataSource<any>();
  visitMasterList: any = [];
  marketingPersonList: any;
  checkInData: Object;
  checkIn: any;
  location: any;
  checkedLocation: any;
  devicecurrentTime: Date;
  fromDate: any;
  toDate: any;

  constructor(
    private visitMaster: VisitMasterService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private router: Router,
    private _enquiryService: EnquiryService,
    private toasterService: ToasterService
  ) {
    const currentDate = new Date();
    this.visitForm = this.fb.group({
      fromDate: [currentDate],
      toDate: [currentDate],
      salesPerson: ['all']
    });
  }

  ngOnInit() {
    this.fetchVisitMaster();
    this.getMarketingPersonList();
  }

  fetchVisitMaster(): void {
    const formValues = this.visitForm.value;
    const fromDate = this.datePipe.transform(formValues.fromDate, 'dd-MMM-yyyy');
    const toDate = this.datePipe.transform(formValues.toDate, 'dd-MMM-yyyy');

    this.visitMaster.getVisitMasterList(fromDate, toDate).subscribe({
      next: (data) => {
        this.visitMasterList = data;
        this.dataSource.data = this.visitMasterList;
      },
      error: (error) => {
        console.error('Error fetching visit master list', error);
      }
    });
  }

  filterVisits() {
    const formValues = this.visitForm.value;
    const fromDate = formValues.fromDate ? this.normalizeDate(new Date(formValues.fromDate)) : null;
    const toDate = formValues.toDate ? this.normalizeDate(new Date(formValues.toDate)) : null;
    const salesPerson = formValues.salesPerson;
  
    this.dataSource.data = this.visitMasterList.filter(visit => {
      const visitDate = this.normalizeDate(new Date(visit.Date));
      const isDateInRange = (!fromDate || visitDate >= fromDate) && (!toDate || visitDate <= toDate);
      const isSalesPersonMatch = salesPerson === 'all' || visit.UserName === salesPerson;
      return isDateInRange && isSalesPersonMatch;
    });
  }
  
  // Helper method to normalize the date (set time to 00:00:00)
  normalizeDate(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    if (view === 'month') {
      const date = cellDate.toISOString().split('T')[0];
      const hasData = this.visitMasterList.some(visit => visit.Date === date);
      return hasData ? 'highlight-date' : '';
    }
    return '';
  };

  getMarketingPersonList(){
    this._enquiryService.salePerson().subscribe({
      next: (data) => {
        this.marketingPersonList = data;
      },
      error: (error) => {
        console.error('Error fetching marketing person list', error);
      }
    });
  }

  openEditVisitMaster(){
    this.router.navigate(['/transactions/Edit-Visit-Master']);
  }

  checkButtonStatus(visit: any, buttonType: string): boolean {
    const VisitMaster_Code = visit.VisitMaster_Code;
    const CheckOut = visit.CheckOut;
    const Closed = visit.Closed;
  
    if (buttonType === 'CheckIn') {
      if (VisitMaster_Code > 0 && CheckOut === 0) return false; // Checked-in
      if (VisitMaster_Code > 0 && CheckOut !== 0) return false; // Checked-out
      if (Closed === "Y") return false; // Closed
      return true; // checkIn
    } else if (buttonType === 'edit') {
      if (VisitMaster_Code > 0 && CheckOut === 0) return true; // Checked-in
      if (VisitMaster_Code > 0 && CheckOut !== 0) return false; // Checked-out
      if (Closed === "Y") return false; // Closed
      return false; // checkIn
    } else if (buttonType === 'view') {
      // If visit is either checked in or checked out, enable the button
      if (VisitMaster_Code > 0) return true; // Checked-in or Checked-out
      // If visit is closed, disable the button
      if (Closed === "Y") return false; // Closed
      // Otherwise, disable the button
      return false; // checkIn
    } else if (buttonType === 'NotVisited') {
      if (VisitMaster_Code > 0 && CheckOut === 0) return false; // Checked-in
      if (VisitMaster_Code > 0 && CheckOut !== 0) return false; // Checked-out
      if (Closed === "Y") return false; // Closed
      return true; // not-visited
    } else {
      return false;
    }
  }
  

  getButtonLabel(visit: any, buttonType: string): string {
    const VisitMaster_Code = visit.VisitMaster_Code;
    const CheckOut = visit.CheckOut;
    const Closed = visit.Closed;
  
    if (buttonType === 'CheckIn') {
      if (VisitMaster_Code > 0 && CheckOut === 0) return 'Checked-out';
      if (VisitMaster_Code > 0 && CheckOut !== 0 ) return 'Checked-in';
      if (Closed === "Y") return 'CheckIn';
      return 'CheckIn';
    } else if (buttonType === 'NotVisited') {
      if (VisitMaster_Code > 0 && CheckOut === 0) return 'Verified';
      if (VisitMaster_Code > 0 && CheckOut !== 0) return 'Verified';
      if (Closed === "Y") return 'Close';
      return 'Not Visited';
    } else {
      return buttonType;
    }
  }

  checkInVisit(visit: any) {
    debugger
    const currentDate = new Date();
    const visitDate = new Date(visit.Date);
    
    // Strip the time part of both dates for comparison
    const currentDateOnly = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    const visitDateOnly = new Date(visitDate.getFullYear(), visitDate.getMonth(), visitDate.getDate());
    
    if (visitDateOnly < currentDateOnly) {
      alert('Check-In is not allowed for the record because Visit date is less than Current date.');
      return;
    }
  
    this.getDeviceLocation().then(location => {
      const currentTime = this.formatCurrentTimeIn24Hour();  // Format the current time as HH:MM
      const latitude = location.latitude;
      const longitude = location.longitude;
  
      this.visitMaster.checkIn(visit.Code, currentTime, `Latitude: ${latitude} Longitude: ${longitude}`, 'Noida').subscribe({
        next: (data) => {
          this.checkInData = data;
        },
        error: (error) => {
          this.toasterService.showError(error.message)
          console.error('Error fetching visit master list', error);
        }
      });
    }).catch(error => {
      console.error('Error getting location', error);
      alert('Unable to get your location. Please ensure location services are enabled.');
    });
  }
  
  // Function to format the current time as HH:MM
  formatCurrentTimeIn24Hour() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }
  
  private getDeviceLocation(): Promise<{ latitude: number, longitude: number }> {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            });
          },
          (error) => {
            reject(error);
          }
        );
      } else {
        reject(new Error('Geolocation is not supported by this browser.'));
      }
    });
  }
  
}
