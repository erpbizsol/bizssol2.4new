import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ChemicalService } from '../../../services/Master/chemical.service';
import {ChemicalDialogComponent} from '../chemical/chemical-dialog/chemical-dialog.component'
import { DeleteConfermationPopUpComponent } from 'src/app/pop-up/delete-confermation/delete-confermation-pop-up/delete-confermation-pop-up.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ButtonDirective, ModalComponent, ModalHeaderComponent, ModalTitleDirective, ThemeDirective, ButtonCloseDirective, ModalBodyComponent, ModalFooterComponent } from '@coreui/angular';
import { MatSort } from '@angular/material/sort';
import { MatSortModule } from '@angular/material/sort';

@Component({
  selector: 'app-chemical',
  standalone: true,
  providers: [ChemicalService],
  imports: [HttpClientModule,MatTableModule,MatPaginatorModule,MatSortModule, ReactiveFormsModule,MatIconModule, CommonModule,ButtonDirective, ModalComponent, ModalHeaderComponent, ModalTitleDirective, ThemeDirective, ButtonCloseDirective, ModalBodyComponent, ModalFooterComponent],
  templateUrl: './chemical.component.html',
  styleUrl: './chemical.component.scss'
})
export class ChemicalComponent implements OnInit {
  displayedColumns: string[] = ['sNo', 'chemicalname', 'sortorder','ischemicalproperty', 'action'];
  dataSource = new MatTableDataSource<any>([]);
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  

  constructor(private _chemicalService: ChemicalService, public dialog: MatDialog) {}

  ngOnInit() {
    this.getChemicalData();
  }

  getChemicalData() {

    this._chemicalService.getChemicalList('GetChemicalMasterList').subscribe({
      next: (res: any) => {
        res.sort((a: any, b: any) => a.Code - b.Code);
        this.dataSource.data = res.reverse();
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: (err: any) => {
        // console.log(err.error.Msg);
      }
    });
  }

  deleteChemical(code: number) {
    const dialogRef = this.dialog.open(DeleteConfermationPopUpComponent, {
      width: '375px',
      data: { message: 'Are you sure you want to delete this Chemical?', reason: '', code: code }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.confirmed) {
        const reason = result.reason;
        this._chemicalService.deleteChemical(code, reason).subscribe((res) => {
          console.log(`${code} has been deleted`);
          const responseObj = JSON.parse(JSON.stringify(res));
          this.getChemicalData();
          alert(responseObj.Msg);
        });
      }
    });
  }

  addDialog(value: any) {
    const dialogRef = this.dialog.open(ChemicalDialogComponent, {
      width: '700px',
      height: '380px',
      disableClose: true,
      data: { element: value }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log(`Dialog result: ${result}`);
      this.getChemicalData();
    });
  }

  
}
