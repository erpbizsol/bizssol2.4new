import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  private selectedItemSource = new BehaviorSubject<string>('Home');
  selectedItem$ = this.selectedItemSource.asObservable();
  setSelectedItem(item: string) {
    debugger
    this.selectedItemSource.next(item);
  }
}
