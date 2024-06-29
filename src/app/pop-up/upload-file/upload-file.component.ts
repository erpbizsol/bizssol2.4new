import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-upload',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})
export class UploadFileComponent {
  @Output() fileSelected = new EventEmitter<File[]>();
  selectedFiles: File[] = [];
  selectedFileNames: string[] = [];

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles = Array.from(input.files);
      // Update selected file names array
      this.selectedFileNames = this.selectedFiles.map(file => file.name);
    }
  }

  uploadFiles() {
    this.fileSelected.emit(this.selectedFiles);
    this.selectedFiles = []; // Clear selected files after emitting
    this.selectedFileNames = []; // Clear selected file names after emitting
  }
}
