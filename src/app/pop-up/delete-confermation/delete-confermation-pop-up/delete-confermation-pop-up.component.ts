import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-delete-confermation-pop-up',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatFormFieldModule, FormsModule, HttpClientModule, MatInputModule],
  templateUrl: './delete-confermation-pop-up.component.html',
  styleUrl: './delete-confermation-pop-up.component.scss'
})
export class DeleteConfermationPopUpComponent {
  reason: string = '';

  constructor(
    public dialogRef: MatDialogRef<DeleteConfermationPopUpComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {reason: string, code: any }
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick(): void {
    this.dialogRef.close({ reason: this.reason, confirmed: true });
  }
}
