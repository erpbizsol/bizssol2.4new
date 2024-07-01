import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [MatIconModule, CommonModule],
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})
export class UploadFileComponent {
  @Output() fileSelected = new EventEmitter<File>();
  selectedFile: File | null = null;
  selectedFileName: string = '';

  constructor(
    public dialogRef: MatDialogRef<UploadFileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.selectedFileName = this.selectedFile.name;
    }
  }

  uploadFiles() {
    if (this.selectedFile) {
      this.fileSelected.emit(this.selectedFile);
      this.selectedFile = null; // Clear selected file after emitting
      this.selectedFileName = ''; // Clear selected file name after emitting
    }
  }

  onClickOfRemoveFile() {
    this.selectedFile = null;
    this.selectedFileName = '';
  }

  closePopup() {
    this.dialogRef.close();
  }
}
