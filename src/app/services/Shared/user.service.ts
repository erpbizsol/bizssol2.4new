import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userDetails = new BehaviorSubject<any>(this.getUserDetailsFromSession());

  setUserDetails(details: any): void {
    sessionStorage.setItem('userDetails', JSON.stringify(details));
    this.userDetails.next(details);
  }

  getUserDetailsFromSession(): any {
    const userDetails = sessionStorage.getItem('userDetails');
    return userDetails ? JSON.parse(userDetails) : null;
  }

  getUserDetail(): any {
    return this.userDetails.asObservable();
  }
}
