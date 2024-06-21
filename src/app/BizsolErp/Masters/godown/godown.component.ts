
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ButtonDirective, ModalComponent, ModalHeaderComponent, ModalTitleDirective, ThemeDirective, ButtonCloseDirective, ModalBodyComponent, ModalFooterComponent } from '@coreui/angular';
import { MatSort } from '@angular/material/sort';
import { MatSortModule } from '@angular/material/sort';
import { GodownService} from 'src/app/services/Master/godown.service';
import {AddGodownDialogComponent} from 'src/app/BizsolErp/Masters/godown/add-godown-dialog/add-godown-dialog.component'
import { DeleteConfermationPopUpComponent } from 'src/app/pop-up/delete-confermation/delete-confermation-pop-up/delete-confermation-pop-up.component';

@Component({
  selector: 'app-godown',
  standalone: true,
  imports: [HttpClientModule,MatTableModule,MatPaginatorModule,MatSortModule, ReactiveFormsModule,MatIconModule, CommonModule,ButtonDirective, ModalComponent, ModalHeaderComponent, ModalTitleDirective, ThemeDirective, ButtonCloseDirective, ModalBodyComponent, ModalFooterComponent],

  templateUrl: './godown.component.html',
  styleUrl: './godown.component.scss',
  providers: [GodownService]

})
export class GodownComponent implements OnInit {
  bankList:any
  displayedColumns: string[] = ['sNo', 'wareType','sortOrder','whouseacc','whouseName','whousealias','address','gstNo','mobil','action'];

  // displayedColumns: string[] = ['sNo', 'bankName','aliasName','account','currency','nation','state','city','pin','ifsc','swift','address','taxNo','pan','fax','email','action'];
  dataSource = new MatTableDataSource<any>([]);
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(private godown:GodownService, 
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.getGodownData();
  }

  
  getGodownData() {
    this.godown.getwarehouse('GetWarehouseMasterList').subscribe({
      next: (res: any) => {
        res.sort((a: any, b: any) => a.Code - b.Code);
        this.dataSource.data = res.reverse();
        this.dataSource.sort = this.sort;
          console.log(this.sort,"jjjj")
        this.dataSource.paginator = this.paginator;
      },
      error: (err: any) => {
        console.log(err.error.message);
      }
    });
  }

  deleteGodown(code: number) {
    const dialogRef = this.dialog.open(DeleteConfermationPopUpComponent, {
      width: '375px',
      disableClose:true,
      data: { message: 'Are you sure you want to delete this State?', reason: '', code: code }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.confirmed) {
        const reason = result.reason;
        this.godown.deletwarehouse(code, reason).subscribe((res) => {
          console.log(`${code} has been deleted`);
          const responseObj = JSON.parse(JSON.stringify(res));
          this.getGodownData();
          alert(responseObj.Msg);
        });
      }
    });
  }

  addDialog(value: any) {
    const dialogRef = this.dialog.open(AddGodownDialogComponent, {
      width: '700px',
      height: '380px',
      disableClose: true,
      data :{element:value}
      });

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log(`Dialog result: ${result}`);
      this.getGodownData();
    });
  }
}

