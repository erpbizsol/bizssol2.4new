import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { PaymetntTermService } from 'src/app/services/master/paymetnt-term.service';
import { AddPaymentDialogComponent } from 'src/app/BizsolErp/Masters/payment-term-master/add-payment-dialog/add-payment-dialog.component';
import { DeleteConfermationPopUpComponent } from 'src/app/pop-up/delete-confermation/delete-confermation-pop-up/delete-confermation-pop-up.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ButtonDirective, ModalComponent, ModalHeaderComponent, ModalTitleDirective, ThemeDirective, ButtonCloseDirective, ModalBodyComponent, ModalFooterComponent } from '@coreui/angular';
import { MatSort } from '@angular/material/sort';
import { MatSortModule } from '@angular/material/sort';


@Component({
  selector: 'app-payment-term-master',
  standalone: true,
    imports: [HttpClientModule,MatTableModule,MatPaginatorModule,MatSortModule, ReactiveFormsModule,MatIconModule, CommonModule,ButtonDirective, ModalComponent, ModalHeaderComponent, ModalTitleDirective, ThemeDirective, ButtonCloseDirective, ModalBodyComponent, ModalFooterComponent],

    templateUrl: './payment-term-master.component.html',
    styleUrl: './payment-term-master.component.scss',
    providers: [PaymetntTermService]

})
export class PaymentTermMasterComponent implements OnInit {
  displayedColumns: string[] = ['sNo', 'description', 'status', 'advancePaymentStatus', 'advancePaymentAmount', 'action'];
  dataSource = new MatTableDataSource<any>([]);
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(private payment: PaymetntTermService, public dialog: MatDialog) {}

  ngOnInit() {
    this.getPaymentTermsData();
  }

  getPaymentTermsData() {
    this.payment.getPaymentList('GetPaymentTermsMasterList').subscribe({
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

  deletePayment(code: number) {
    const dialogRef = this.dialog.open(DeleteConfermationPopUpComponent, {
      width: '375px',
      data: { message: 'Are you sure you want to delete this State?', reason: '', code: code }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.confirmed) {
        const reason = result.reason;
        this.payment.deletePaymentList(code, reason).subscribe((res) => {
          console.log(`${code} has been deleted`);
          const responseObj = JSON.parse(JSON.stringify(res));
          this.getPaymentTermsData();
          alert(responseObj.Msg);
        });
      }
    });
  }

  addDialog(value: any) {
    const dialogRef = this.dialog.open(AddPaymentDialogComponent, {
      width: '400px',
      height: '380px',
      disableClose: true,
      data: { element: value }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log(`Dialog result: ${result}`);
      this.getPaymentTermsData();
    });
  }
}
