import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss'
})
export class HistoryComponent {
  constructor(private location: Location) {

  }
  Cancel() {
    this.location.back();
  }
}
