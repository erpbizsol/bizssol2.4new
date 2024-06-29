import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DepartmentService } from 'src/app/services/Master/department.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ButtonCloseDirective, ButtonDirective, ModalBodyComponent, ModalComponent, ModalFooterComponent, ModalHeaderComponent, ModalTitleDirective, ThemeDirective } from '@coreui/angular';
import { DeleteConfermationPopUpComponent } from '../../../pop-up/delete-confermation/delete-confermation-pop-up/delete-confermation-pop-up.component';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';  // Add MatTableModule
import { MatSort } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { SnackBarService } from 'src/app/services/SnakBar-Service/snack-bar.service';

@Component({
  selector: 'app-department',
  standalone: true,
  imports: [
    HttpClientModule,
    ReactiveFormsModule,
    CommonModule,
    ButtonDirective,
    ModalComponent,
    ModalHeaderComponent,
    ModalTitleDirective,
    ThemeDirective,
    ButtonCloseDirective,
    ModalBodyComponent,
    ModalFooterComponent,
    DeleteConfermationPopUpComponent,
    MatPaginatorModule,
    MatTableModule  // Add MatTableModule here
  ],
  templateUrl: './department.component.html',
  styleUrl: './department.component.scss',
  providers: [DepartmentService]
})
export class DepartmentComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  department: any = [];
  newDepartmentForm: FormGroup;
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['S.No.', 'Department Code', 'Department Name', 'Action'];

  constructor(private _DepartmentService: DepartmentService, private fb: FormBuilder, private dialog: MatDialog, private snackBarService: SnackBarService) { }

  public visible = false;
  public visible1 = false;

  toggleLiveDemo() {
    this.visible = !this.visible;
    this.ClearData();
  }

  editDemoModal() {
    this.visible1 = !this.visible;
    this.ClearData();
  }

  handleLiveDemoChange(event: any) {
    this.visible = event;
  }

  ngOnInit() {
    this.departmentList();
    this.newDepartmentForm = this.fb.group({
      Code: ['', Validators.required],
      departmentName: ['', Validators.required],
      departmentCode: ['', Validators.required],
    });
  }

  departmentList() {
    this._DepartmentService.getDepartment().subscribe(res => {
      this.department = res;
      this.dataSource = new MatTableDataSource(this.department);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort; // Add sorting to the table
    });
  }

  saveDepartment() {
    let obj = {
      departmentMaster: [
        {
          code: this.newDepartmentForm.get('Code').value == '' ? '0' : this.newDepartmentForm.get('Code').value,
          departmentName: this.newDepartmentForm.value.departmentName,
          initials: this.newDepartmentForm.value.departmentCode,
          UserMaster_Code: '141',
        },
      ],
    };
    this._DepartmentService.postDepartment(obj).subscribe({
      next: (res: any) => {
        let obj = JSON.stringify(res);
        let responseObject = JSON.parse(obj);
        this.snackBarService.showSuccessMessage(responseObject.Msg);
        if (responseObject.Msg == 'Data updated successfully.') {
          this.editDemoModal();
          this.ClearData();
        } else {
          this.toggleLiveDemo();
          this.ClearData();
        }
        this.departmentList();
      },
    });
  }

  editData(code: number) {
    this.editDemoModal();
    this._DepartmentService.editDepartment(code).subscribe(res => {
      this.newDepartmentForm.patchValue({
        Code: res.Code,
        departmentName: res.DepartmentName,
        departmentCode: res.Initials,
      });
    });
  }

  deleteData(code: number): void {
    const dialogRef = this.dialog.open(DeleteConfermationPopUpComponent, {
      width: '375px',
      data: { message: 'Are you sure you want to delete this followUp?', code: code },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let reason = result.reason;
        this._DepartmentService.deleteDepartment(code, reason).subscribe({
          next: result => {
            let responseObject = result;
            alert(responseObject.Msg);
            this.departmentList();
          },
          error: err => {
            console.log(err);
            alert('An error occurred while deleting the record.');
          },
        });
      }
    });
  }

  ClearData() {
    this.newDepartmentForm.patchValue({
      Code: '0',
      departmentName: '',
      departmentCode: '',
    });
  }
}
