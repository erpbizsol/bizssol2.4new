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
import {CategoryService} from '../../../services/Master/category.service';
import { CategoryDialogComponent } from './category-dialog/category-dialog.component';
import { DeleteConfermationPopUpComponent } from 'src/app/pop-up/delete-confermation/delete-confermation-pop-up/delete-confermation-pop-up.component';

@Component({
  selector: 'app-category-master',
  standalone: true,
  providers: [CategoryService],
  imports: [HttpClientModule,MatTableModule,MatPaginatorModule,MatSortModule, ReactiveFormsModule,MatIconModule, CommonModule,ButtonDirective, ModalComponent, ModalHeaderComponent, ModalTitleDirective, ThemeDirective, ButtonCloseDirective, ModalBodyComponent, ModalFooterComponent],
  templateUrl: './category-master.component.html',
  styleUrl: './category-master.component.scss'
})
export class CategoryMasterComponent {

  displayedColumns: string[] = ['sNo', 'categoryname', 'categorydescription','componentcost', 'action'];
  dataSource = new MatTableDataSource<any>([]);
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private _categoryService:CategoryService ,public dialog:MatDialog){}

  ngOnInit(){
    this.getCategoryData();
    
    
  }

  getCategoryData() {

    this._categoryService.getCategorylist().subscribe({
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
      data: { message: 'Are you sure you want to delete this Category?', reason: '', code: code }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.confirmed) {
        const reason = result.reason;
        this._categoryService.deleteCategory(code, reason).subscribe((res) => {
          console.log(`${code} has been deleted`);
          const responseObj = JSON.parse(JSON.stringify(res));
          this.getCategoryData();
          alert(responseObj.Msg);
        });
      }
    });
  }

////////////////////////////////////////////////Add dialog dimensions and functionality////////////////////////////////

  addDialog(value: any) {
    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      width: '400px',
      height: '390px',
      disableClose: true,
      data: { element: value }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log(`Dialog result: ${result}`);
      this.getCategoryData();
    });
  }



}
