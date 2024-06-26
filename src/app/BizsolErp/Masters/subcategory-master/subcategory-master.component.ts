import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ButtonCloseDirective, ButtonDirective, ModalBodyComponent, ModalComponent, ModalFooterComponent, ModalHeaderComponent, ModalTitleDirective, ThemeDirective } from '@coreui/angular';
import {SubcategoryService} from '../../../services/Master/subcategory.service';
import { SubcategoryDialogComponent } from './subcategory-dialog/subcategory-dialog.component';
import { DeleteConfermationPopUpComponent } from 'src/app/pop-up/delete-confermation/delete-confermation-pop-up/delete-confermation-pop-up.component';

@Component({
  selector: 'app-subcategory-master',
  standalone: true,
  providers: [SubcategoryService],
  imports: [HttpClientModule,MatTableModule,MatPaginatorModule,MatSortModule, ReactiveFormsModule,MatIconModule, CommonModule,ButtonDirective, ModalComponent, ModalHeaderComponent, ModalTitleDirective, ThemeDirective, ButtonCloseDirective, ModalBodyComponent, ModalFooterComponent],
  templateUrl: './subcategory-master.component.html',
  styleUrl: './subcategory-master.component.scss'
})
export class SubcategoryMasterComponent {

  displayedColumns: string[] = ['sNo', 'categoryname', 'categorydescription','componentcost', 'action'];
  dataSource = new MatTableDataSource<any>([]);
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private _subcategoryService:SubcategoryService ,public dialog:MatDialog){}

  ngOnInit(){
    this.getSubCategoryData();
    
  }

  getSubCategoryData() {

    this._subcategoryService.getSubCategorylist().subscribe({
      next: (res: any) => {
        res.sort((a: any, b: any) => a.Code - b.Code);
        this.dataSource.data = res.reverse();
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        // console.log(res);
      },
      error: (err: any) => {
        // console.log(err.error.Msg);
      }
    }); 
  }

//////////////////////////////////////////////Delete function for the category//////////////////////////////////////////////
  deleteChemical(code: number) {
    const dialogRef = this.dialog.open(DeleteConfermationPopUpComponent, {
      width: '375px',
      data: { message: 'Are you sure you want to delete this SubCategory?', reason: '', code: code }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.confirmed) {
        const reason = result.reason;
        this._subcategoryService.deleteSubCategory(code, reason).subscribe((res) => {
          console.log(`${code} has been deleted`);
          const responseObj = JSON.parse(JSON.stringify(res));
          this.getSubCategoryData();
          alert(responseObj.Msg);
        });
      }
    });
  }

////////////////////////////////////////////////Add dialog dimensions and functionality////////////////////////////////

  addDialog(value: any) {
    const dialogRef = this.dialog.open(SubcategoryDialogComponent, {
      width: '410px',
      height: '425px',
      disableClose: true,
      data: { element: value }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log(`Dialog result: ${result}`);
      this.getSubCategoryData();
    });
  }



}
