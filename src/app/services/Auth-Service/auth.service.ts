import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  setAuthKey(authKey: string): void {
    sessionStorage.setItem('Auth-Key', authKey);
  }

  getAuthKey(): string | null {
    return sessionStorage.getItem('Auth-Key');
  }

  getUserMasterCode(): string | null {
    const authKey = this.getAuthKey();
    if (authKey) {
      const parsedAuthKey = JSON.parse(authKey);
      return parsedAuthKey.UserMaster_Code || null;
    }
    return null;
  }
}
