import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-chemical',
  standalone: true,
  providers:[FormControlName],
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './chemical.component.html',
  styleUrl: './chemical.component.scss'
})
export class ChemicalComponent {




  displayedColumns: string[] = ['SN','ChemicalName', 'Pin','InspectionMethod', 'Action'];
  columnDisplayNames: { [key: string]: string } = {
    'SN': 'SN',
    'ChemicalName': 'Chemical Name',
    'CityName': 'Sort Order',
    'InspectionMethod': 'Inspection Method',
    'Action': 'Action'
  };
  chemicalForm!: FormGroup;
  chemicalhide: boolean = false;
  dataSource: MatTableDataSource<any>;




  constructor(private fb: FormBuilder, private changeDetect: ChangeDetectorRef,private dialog: MatDialog) { }
  setForm() {
    this.chemicalForm = this.fb.group({
      chemical: ['', [Validators.required, Validators.maxLength(3)]],
      sortorder: ['', [Validators.required, Validators.maxLength(3)]],
      inspection: ['', [Validators.required, Validators.maxLength(3)]],

    })
  }

  showchemical() {
    this.chemicalhide = true;
    this.changeDetect.detectChanges;
  }
  showmechemical() {
    this.chemicalhide = false;
    this.changeDetect.detectChanges();


  }
  /////////////////////////////////////////////////////////Create chemical//////////////////////////////////////////////////////////////

  chemicalsubmit() {



  }
/////////////////////////////////////////////////////////////////Edit Chemical/////////////////////////////////////////////////////////
editState(_t44: any) {
  

}
/////////////////////////////////////////////////////////////////Delete Chemical////////////////////////////////////////////////////////

  deleteState(arg0: any) {
    

  }

   
}
