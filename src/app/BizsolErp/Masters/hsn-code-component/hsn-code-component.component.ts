import { Component, ElementRef, Inject, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { AddHSNCodeMasterComponent } from 'src/app/BizsolErp/Masters/hsn-code-component/add-hsn-code-master/add-hsn-code-master.component';
import { DeleteConfermationPopUpComponent } from 'src/app/pop-up/delete-confermation/delete-confermation-pop-up/delete-confermation-pop-up.component';
import { FormBuilder, FormGroup } from '@angular/forms';
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
  _AddHSNCodeMaster: any;

  constructor(private hsnCodeService: HSNCodeMasterService, private fb: FormBuilder, public dialog: MatDialog) {

  }


  ngOnInit() {
    this.loadHSNCodeData();
  }

  loadLsn:any
  loadHSNCodeData() {
    this.hsnCodeService.getHSNCodeMaterList().subscribe(res => {
      this.loadLsn = res.HSNCodeMaster;
      this.dataSource = new MatTableDataSource(this.loadLsn)
      this.dataSource.paginator = this.paginator; 

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
  editHSnCode: any
  editId: any

  editHSNCodeMaster(value: any) {
    this.editId = value
    console.log(this.editId, "hh")
    this.hsnCodeService.editHSNCodeMasters(this.editId).subscribe(res => {
      this.editHSnCode = res
      console.log(this.editHSnCode, "kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk")



      this.addDialog(this.editHSnCode)
      // this._AddHSNCodeMaster.populateHSNCodeMaster(res.HSNCodeMaster);
      // this._AddHSNCodeMaster.HSNCodeDetailspopulateTableRows(res.HSNCodeDetails);
      // this._AddHSNCodeMaster.HSNCodeExportRateBenefitDetailpopulateRows(res.HSNCodeExportRateBenefitDetail);
    })
  }

  editCode: any

  addDialog(value: any) {
    console.log("value", value)
    // if(value !=''){
    //   this.editCode=value?.Code
    //   this.editHSNCodeMaster(this.editCode)
    // }
    const dialogRef = this.dialog.open(AddHSNCodeMasterComponent, {
      width: '750px',
      height: '420px',
      disableClose: true,
      data: {
        element: value,

      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.loadHSNCodeData();
      }
    });
  }
}

