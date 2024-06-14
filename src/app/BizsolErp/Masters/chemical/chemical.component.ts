import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { ChemicalService } from 'src/app/services/Master/chemical.service';
import { HttpClientModule } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { ButtonCloseDirective, ButtonDirective, ModalBodyComponent, ModalComponent, ModalFooterComponent, ModalHeaderComponent, ModalTitleDirective, ThemeDirective } from '@coreui/angular';
import {ChemicalDialogComponent} from '../chemical/chemical-dialog/chemical-dialog.component';
import { DeleteConfermationPopUpComponent } from 'src/app/pop-up/delete-confermation/delete-confermation-pop-up/delete-confermation-pop-up.component';
@Component({
  selector: 'app-chemical',
  standalone: true,
  providers: [ChemicalService],
  imports: [ReactiveFormsModule, FormsModule,HttpClientModule, CommonModule,MatPaginatorModule,MatTableModule,MatSortModule,MatIconModule,CommonModule,ButtonDirective,ModalComponent,ModalHeaderComponent,ModalTitleDirective,ThemeDirective,ButtonCloseDirective,ModalBodyComponent,ModalFooterComponent],
  templateUrl: './chemical.component.html',
  styleUrl: './chemical.component.scss'
})
export class ChemicalComponent {

  displayedColumns: string[] = ['sNo', 'chemical', 'status', 'advancePaymentStatus', 'advancePaymentAmount', 'action'];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  

  constructor(private fb: FormBuilder, private changeDetect: ChangeDetectorRef, private dialog: MatDialog,private _chemicalService: ChemicalService) { }
  

  chemicalForm!: FormGroup;
  chemicalhide: boolean = false;
  chemicalList:any=[];
 

  showchemical() {
    this.chemicalhide = true;
    this.changeDetect.detectChanges;
  }
  showmechemical() {
    this.chemicalhide = false;
    this.changeDetect.detectChanges();
  }
  getChemicalList(){
    this._chemicalService.getChemicalList().subscribe(res=>{
      this.chemicalList=res;
      console.log(this.chemicalList);
    })
  }
  getChemicalData() {
    this._chemicalService.getChemicalList().subscribe({
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
  
  /////////////////////////////////////////////////////////////////Edit Chemical/////////////////////////////////////////////////////////
  editState(_t44: any) {


  }
  /////////////////////////////////////////////////////////////////Delete Chemical////////////////////////////////////////////////////////

  deleteChemical(code: number) {
    const dialogRef = this.dialog.open(DeleteConfermationPopUpComponent, {
      width: '375px',
      data: { message: 'Are you sure you want to delete this State?', reason: '', code: code }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.confirmed) {
        const reason = result.reason;
        this._chemicalService.deleteChemicalList(code, reason).subscribe((res) => {
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
      width: '400px',
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

