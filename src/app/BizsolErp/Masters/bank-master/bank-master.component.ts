


  import { Component, OnInit, ViewChild } from '@angular/core';
  import { MatDialog } from '@angular/material/dialog';
  import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
  import { MatTableDataSource, MatTableModule } from '@angular/material/table';
  import { BankService } from 'src/app/services/Master/bank.service';
  import { AddBankDialogComponent } from 'src/app/BizsolErp/Masters/bank-master/add-bank-dialog/add-bank-dialog.component';
  import { DeleteConfermationPopUpComponent } from 'src/app/pop-up/delete-confermation/delete-confermation-pop-up/delete-confermation-pop-up.component';
  import { CommonModule } from '@angular/common';
  import { HttpClientModule } from '@angular/common/http';
  import { ReactiveFormsModule } from '@angular/forms';
  import { MatIconModule } from '@angular/material/icon';
  import { ButtonDirective, ModalComponent, ModalHeaderComponent, ModalTitleDirective, ThemeDirective, ButtonCloseDirective, ModalBodyComponent, ModalFooterComponent } from '@coreui/angular';
  import { MatSort } from '@angular/material/sort';
  import { MatSortModule } from '@angular/material/sort';


  @Component({
      selector: 'app-bank-master',
       standalone: true,
       imports: [HttpClientModule,MatTableModule,MatPaginatorModule,MatSortModule, ReactiveFormsModule,MatIconModule, CommonModule,ButtonDirective, ModalComponent, ModalHeaderComponent, ModalTitleDirective, ThemeDirective, ButtonCloseDirective, ModalBodyComponent, ModalFooterComponent],
       templateUrl: './bank-master.component.html',
       styleUrl: './bank-master.component.scss',
       providers: [BankService]

  })
  export class BankMasterComponent implements OnInit {
    bankList:any
    displayedColumns: string[] = ['sNo', 'bankName','aliasName','state','city','pin','ifsc','address','action'];

    // displayedColumns: string[] = ['sNo', 'bankName','aliasName','account','currency','nation','state','city','pin','ifsc','swift','address','taxNo','pan','fax','email','action'];
    dataSource = new MatTableDataSource<any>([]);
    
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;


    constructor(private bank: BankService, public dialog: MatDialog) {}

    ngOnInit() {
      this.getBankData();
    }

    
    getBankData() {
      this.bank.getPaymentList('GetBankMasterList').subscribe({
        next: (res: any) => {
          res.sort((a: any, b: any) => a.Code - b.Code);
          this.dataSource.data = res.reverse();
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        },
        error: (err: any) => {
          console.log(err.error.message);
        }
      });
    }

    deleteBank(code: number) {
       console.log("hii",code)
      const dialogRef = this.dialog.open(DeleteConfermationPopUpComponent, {
        width: '375px',
        disableClose:true,
        data: { message: 'Are you sure you want to delete this State?', reason: '', code: code }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result && result.confirmed) {
          const reason = result.reason;
          this.bank.deleteBank(code, reason).subscribe((res) => {
            console.log(`${code} has been deleted`);
            const responseObj = JSON.parse(JSON.stringify(res));
            this.getBankData();
            alert(responseObj.Msg);
          });
        }
      });
    }

    addDialog(value: any) {
      const dialogRef = this.dialog.open(AddBankDialogComponent, {
        width: '800px',
        height: '530px',
        disableClose: true,
        data :{element:value}
        });

      dialogRef.afterClosed().subscribe((result: any) => {
        console.log(`Dialog result: ${result}`);
        this.getBankData();
      });
    }

    openDialog(value: any,type:any) {
      const dialogRef = this.dialog.open(AddBankDialogComponent, {
        width: '800px',
        height: '530px',
        disableClose: true,
        data :{element:value,
          view:type
        }
        });

      dialogRef.afterClosed().subscribe((result: any) => {
        console.log(`Dialog result: ${result}`);
        this.getBankData();
      });
    }
  }

