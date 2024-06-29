// import { Component, ViewChild } from '@angular/core';
// import { MatTableDataSource, MatTableModule } from '@angular/material/table';
// import { CommonModule } from '@angular/common';
// import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// import { CountryService } from "../../../services/Master/country.service";
// import { HttpClientModule } from "@angular/common/http"
// import { ButtonCloseDirective, ButtonDirective, FormModule, ModalBodyComponent, ModalComponent, ModalFooterComponent, ModalHeaderComponent, ModalTitleDirective, PageItemDirective, PageLinkDirective, PaginationComponent, ThemeDirective } from '@coreui/angular';
// import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
// // import { NgxPaginationModule } from 'ngx-pagination';
// import { RouterLink } from '@angular/router';
// import { MatSort } from '@angular/material/sort';
// import { MatError } from '@angular/material/form-field';
// import { MatDialog } from '@angular/material/dialog';
// import { DeleteConfermationPopUpComponent } from 'src/app/pop-up/delete-confermation/delete-confermation-pop-up/delete-confermation-pop-up.component';


// @Component({
//   selector: 'app-country-table',
//   standalone: true,
//   imports: [MatTableModule, HttpClientModule, MatPaginatorModule, ButtonDirective, FormModule, ReactiveFormsModule, MatPaginatorModule, CommonModule, ButtonDirective, ModalComponent,
//     ModalHeaderComponent, ModalTitleDirective, ThemeDirective, ButtonCloseDirective, ModalBodyComponent, ModalFooterComponent, PaginationComponent,
//     PageItemDirective,
//     PageLinkDirective,
//     RouterLink, MatError],
//   providers: [CountryService],
//   templateUrl: './country-table.component.html',
//   styleUrl: './country-table.component.scss'
// })
// export class CountryTableComponent {



  
// }
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { FormControlName, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ButtonCloseDirective, ButtonDirective, ModalBodyComponent, ModalComponent, ModalFooterComponent, ModalHeaderComponent, ModalTitleDirective, ThemeDirective } from '@coreui/angular';
import { CountryDialogComponent } from './country-dialog/country-dialog.component';
import { DeleteConfermationPopUpComponent } from 'src/app/pop-up/delete-confermation/delete-confermation-pop-up/delete-confermation-pop-up.component';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CountryService } from 'src/app/services/Master/country.service';


@Component({
  selector: 'app-category-master',
  standalone: true,
  providers: [CountryService,FormControlName],
  imports: [HttpClientModule,MatTableModule,MatPaginatorModule,MatSortModule, ReactiveFormsModule,MatIconModule, CommonModule,ButtonDirective, ModalComponent, ModalHeaderComponent, ModalTitleDirective, ThemeDirective, ButtonCloseDirective, ModalBodyComponent, ModalFooterComponent,MatInputModule,MatTableModule,MatSelectModule],
  templateUrl: './country-table.component.html',
  styleUrl: './country-table.component.scss'
})
export class CountryTableComponent {

  displayedColumns: string[] = ['sNo', 'countryname','countrycode', 'action'];
  dataSource = new MatTableDataSource<any>([]);
  countrylist: any = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private _countryService:CountryService ,public dialog:MatDialog){}

  ngOnInit(){
    this.getCountryData();

  }

  getCountryData() {

    this._countryService.getCountry().subscribe({

      next: (res: any) => {
        res.sort((a: any, b: any) => a.Code - b.Code);
        this.dataSource.data = res.reverse();
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.countrylist=res;
        console.log(this.countrylist,"Hial");
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
      data: { message: 'Are you sure you want to delete this Country?', reason: '', code: code }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.confirmed) {
        const reason = result.reason;
        this._countryService.deleteCountry(code, reason).subscribe((res) => {
          console.log(`${code} has been deleted`);
          const responseObj = JSON.parse(JSON.stringify(res));
          this.getCountryData();
          alert(responseObj.Msg);
        });
      }
    });
  }

////////////////////////////////////////////////Add dialog dimensions and functionality////////////////////////////////

  addDialog(value: any) {
    const dialogRef = this.dialog.open(CountryDialogComponent, {
      width: '450px',
      height: '280px',
      disableClose: true,
      data: { element: value }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log(`Dialog result: ${result}`);
      this.getCountryData();
    });
  }



}
