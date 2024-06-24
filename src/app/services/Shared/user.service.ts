import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  private userDetails: any = {};

  setUserDetails(details: any): void {
    this.userDetails = details;
    console.log("yggyg8uy",  this.userDetails)

  }

  getUserDetails(): any {
    return this.userDetails;
  }
}
