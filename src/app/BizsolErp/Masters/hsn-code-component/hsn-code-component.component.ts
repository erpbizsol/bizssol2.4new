import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { AddHSNCodeMasterComponent } from 'src/app/BizsolErp/Masters/hsn-code-component/add-hsn-code-master/add-hsn-code-master.component';
import { DeleteConfermationPopUpComponent } from 'src/app/pop-up/delete-confermation/delete-confermation-pop-up/delete-confermation-pop-up.component';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { HSNCodeMasterService } from 'src/app/services/Master/hsn-code-master.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-hsn-code-component',
  standalone: true,
  imports: [HttpClientModule, MatTableModule, MatPaginatorModule, CommonModule],
  templateUrl: './hsn-code-component.component.html',
  styleUrl: './hsn-code-component.component.scss',
  providers: [HSNCodeMasterService]
})
export class HSNCodeMasterComponent implements OnInit {
  @ViewChildren('levelInput') levelInputs!: QueryList<ElementRef>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  newHSNCodeForm: FormGroup;
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['sNo', 'HSNCode', 'ProductDescription', 'action'];

  constructor(private hsnCodeService: HSNCodeMasterService, private fb: FormBuilder, public dialog: MatDialog) { }


  ngOnInit() {
    this.loadHSNCodeData();
  }


  loadHSNCodeData() {
    this.hsnCodeService.getHSNCodeMaterList().subscribe(res => {
      this.dataSource = res.HSNCodeMaster;
      console.log(this.dataSource);

    });
  }

  deleteHSNCodeMaster(code: number) {
    const dialogRef = this.dialog.open(DeleteConfermationPopUpComponent, {
      width: '375px',
      disableClose: true,
      data: { message: 'Are you sure you want to delete this State?', reason: '', code: code }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.confirmed) {
        const reason = result.reason;
        this.hsnCodeService.deleteHSNCode(code, reason).subscribe({
          next: (res: any) => {
            const responseObj = JSON.parse(JSON.stringify(res));
            alert(responseObj.Msg);
            this.loadHSNCodeData();
          },
          error: (err: any) => {
            console.error('Error deleting HSN Code:', err);
            alert('Failed to delete HSN Code.');
          }
        });
      }
    });
  }

  addDialog(value: any) {
    const dialogRef = this.dialog.open(AddHSNCodeMasterComponent, {
      width: '700px',
      height: '420px',
      disableClose: true,
      data: { element: value }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.loadHSNCodeData();
      }
    });
  }
}

