import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  private selectedItemSubject = new BehaviorSubject<string>('Home');
  selectedItem$ = this.selectedItemSubject.asObservable();

  setSelectedItem(item: string) {
    this.selectedItemSubject.next(item);
  }
}
