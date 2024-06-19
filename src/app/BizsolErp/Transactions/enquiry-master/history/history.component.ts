import { Component, OnInit } from '@angular/core';
import { EnquiryService } from 'src/app/services/Transaction/enquiry.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, DatePipe, Location } from '@angular/common';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule],
  providers: [EnquiryService, DatePipe],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss'
})
export class HistoryComponent implements OnInit {
  history: any = [];
  assignedDeatils: any = [];
  personDeatils: any = [];
  productDeatils: any = [];
  followUpDeatils: any = [];

  enquiryCode: string;
  enquiryDate: string;
  constructor(private location: Location, private _enquiryService: EnquiryService, private route: ActivatedRoute, private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.enquiryCode = this.route.snapshot.paramMap.get('Code');
    this.getHistoryListByEnquiryCode()
  }

  getHistoryListByEnquiryCode(): void {
    this._enquiryService.GetEnquiryHistory(this.enquiryCode).subscribe(res => {
      this.history = res.EnquiryMaster[0];
      this.enquiryDate = this.datePipe.transform(this.history.EnquiryDate, 'dd-MM-yyyy');

      this.assignedDeatils = res.EnquiryAssignPersonDetail;
      this.personDeatils = res.EnquiryContactPersonDetail
      this.productDeatils = res.EnquiryDetail
      this.followUpDeatils = res.EnquiryFollowUpDetail
    })
  }

  Cancel() {
    this.location.back();
  }


}
