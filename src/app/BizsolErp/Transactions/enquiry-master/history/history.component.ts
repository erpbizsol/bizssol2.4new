import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { EnquiryService } from 'src/app/services/Transaction/enquiry.service';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [],
  providers: [EnquiryService],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss'
})
export class HistoryComponent implements OnInit {
  history: any = [];
  constructor(private location: Location, private _enquiryService: EnquiryService) { }

  ngOnInit(): void {
    this.getHistoryListByEnquiryCode()
  }

  getHistoryListByEnquiryCode(): void {
    this._enquiryService.GetEnquiryHistory().subscribe(res => {
      this.history = res.EnquiryMaster[0];
      console.log("object", this.history);
    })
  }






  Cancel() {
    this.location.back();
  }
}
