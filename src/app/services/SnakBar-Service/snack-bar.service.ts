import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {

  constructor(private _snackBar: MatSnackBar) {}

  showSuccessMessage(message: string, duration: number = 2000) {
    this._snackBar.open(message, 'Close', {
      duration: duration,
    });
  }

  showErrorMessage(message: string, duration: number = 2000) {
    this._snackBar.open(message, 'Close', {
      duration: duration,
    });
  }
}
