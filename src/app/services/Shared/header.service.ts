import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  private selectedItemSource = new BehaviorSubject<string>(localStorage.getItem('selectedItem') || '');
  selectedItem$ = this.selectedItemSource.asObservable();

  setSelectedItem(item: string) {
    localStorage.setItem('selectedItem', item);
    this.selectedItemSource.next(item);
  }
}
