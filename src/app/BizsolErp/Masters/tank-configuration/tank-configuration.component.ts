import { Component, OnInit, QueryList, ViewChildren, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormArray, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TankConfigurationService } from 'src/app/services/Master/tank-configuration.service';
import { SnackBarService } from 'src/app/services/SnakBar-Service/snack-bar.service';

@Component({
  selector: 'app-tank-configuration',
  standalone: true,
  imports: [HttpClientModule, ReactiveFormsModule, CommonModule],
  templateUrl: './tank-configuration.component.html',
  styleUrls: ['./tank-configuration.component.scss'],
  providers: [TankConfigurationService]
})
export class TankConfigurationComponent implements OnInit {
  @ViewChildren('levelInput') levelInputs!: QueryList<ElementRef>;

  Tank: any = [];
  newTankForm: FormGroup;
  showTable = false;
  TankConfigurationData: any[] = [];
  dataExist: boolean = false;

  constructor(private tankConfigurationService: TankConfigurationService, private fb: FormBuilder, private snackBarService:SnackBarService) { }

  ngOnInit() {
    this.TankList();
    this.newTankForm = this.fb.group({
      Code: ['0'],
      tankName: ['', Validators.required],
      tableRows: this.fb.array([]),
    });

    this.newTankForm.get('tankName')?.valueChanges.subscribe(() => {
      this.clearTableRows();
      this.showTable = false;
    });
  }

  TankList() {
    this.tankConfigurationService.getTank().subscribe(res => {
      this.Tank = res;
    });
  }

  getTankConfigurationList(TankName: any) {
    this.tankConfigurationService.getTankConfigurationList(TankName).subscribe(res => {
      if(res.length>0)
        {
          this.populateTableRows(res);

        }
      // console.log(res);
    });
  }

  get tableRows(): FormArray {
    return this.newTankForm.get('tableRows') as FormArray;
  }

  clearTableRows() {
    while (this.tableRows.length !== 0) {
      this.tableRows.removeAt(0);
    }
  }

  onFillGo() {
    const tankName1 = this.newTankForm.get('tankName')?.value;
    if (tankName1) {
      this.showTable = true;
      this.getTankConfigurationList(tankName1);
      if (this.tableRows.length === 0) {
        this.addRow();
      }
    } else {
      this.showTable = false;
    }
  }

  populateTableRows(TankConfigurationData: any[]) {
    this.clearTableRows();
    TankConfigurationData.forEach(row => {
      this.tableRows.push(this.fb.group({
        level: [row.TankLevel, [ Validators.pattern(/^\d+$/)]],
        stockValue: [row.StockQty],
      }));
    });

    this.showTable = true;
  }

  addRow() {
    this.tableRows.push(this.fb.group({
      level: ['', [ Validators.pattern(/^\d+$/)]], // Integer only
      stockValue: [''],
    }));

    // Focus the new row's first input element
    setTimeout(() => {
      this.focusNewRow();
    });
  }

  validateInteger(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  validateFloat(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    if ((charCode < 48 || charCode > 57) && charCode !== 46) {
      event.preventDefault();
    }
  }

  onStockValueEnter(event: Event, index: number) {
    const keyboardEvent = event as KeyboardEvent;
    if (keyboardEvent.key === 'Enter') {
      keyboardEvent.preventDefault();

      const rows = this.tableRows.controls;
      const currentRow = rows[index] as FormGroup;
      const stockValue = parseFloat(currentRow.get('stockValue')?.value);
      const levelValue = parseInt(currentRow.get('level')?.value, 10);

      let isValid = true;

      // Check if there is a previous row to compare
      if (index > 0) {
        const previousRow = rows[index - 1] as FormGroup;
        const previousStockValue = parseFloat(previousRow.get('stockValue')?.value);
        const previousLevelValue = parseInt(previousRow.get('level')?.value, 10);

        if (isNaN(stockValue) || isNaN(previousStockValue) || isNaN(levelValue) || isNaN(previousLevelValue)) {
          alert('Invalid values entered.');
          isValid = false;
        } else if (stockValue <= previousStockValue || levelValue <= previousLevelValue) {
          alert("BAD: Current row values must be greater than previous row values.");
          isValid = false;
        }
      } else {
        if (isNaN(stockValue) || isNaN(levelValue)) {
          alert('Invalid values entered.');
          isValid = false;
        }
      }

      if (isValid && currentRow.valid) {
        if (index === rows.length - 1 || this.isValidRow(index)) {
          this.addRow();
        }
      }
    }
  }

  isValidRow(index: number): boolean {
    const rows = this.tableRows.controls;
    const currentRow = rows[index] as FormGroup;
    const lastRow = rows[rows.length - 1] as FormGroup;

    const currentStockValue = parseFloat(currentRow.get('stockValue')?.value);
    const lastStockValue = parseFloat(lastRow.get('stockValue')?.value);

    return !isNaN(currentStockValue) && !isNaN(lastStockValue) && currentStockValue > lastStockValue;
  }

  focusNewRow() {
    const inputArray = this.levelInputs.toArray();
    const newRowInput = inputArray[inputArray.length - 1].nativeElement;
    newRowInput.focus();
  }

  validateAllRows(): boolean {
    this.dataExist = false;
    const rows = this.tableRows.controls;
  
    for (let i = 0; i < rows.length; i++) {
      const currentRow = rows[i] as FormGroup;
      const stockValue = currentRow.get('stockValue')?.value;
      const levelValue = currentRow.get('level')?.value;
  
      // Skip rows with null or empty values
      if (stockValue === null && levelValue === null || stockValue === '' && levelValue === '') {
        continue;
      }
  
      const parsedStockValue = parseFloat(stockValue);
      const parsedLevelValue = parseInt(levelValue, 10);
  
      if (!isNaN(parsedStockValue) && !isNaN(parsedLevelValue)) {
        if (parsedStockValue > 0 && parsedLevelValue > 0) {
          this.dataExist = true;
        }
      }
  
      // Check consistency with the previous non-null row
      let j = i - 1;
      while (j >= 0) {
        const previousRow = rows[j] as FormGroup;
        const previousStockValue = previousRow.get('stockValue')?.value;
        const previousLevelValue = previousRow.get('level')?.value;
  
        if (previousStockValue !== null && previousLevelValue !== null && previousStockValue !== '' && previousLevelValue !== '') {
          const parsedPreviousStockValue = parseFloat(previousStockValue);
          const parsedPreviousLevelValue = parseInt(previousLevelValue, 10);
  
          if (
            isNaN(parsedStockValue) ||
            isNaN(parsedPreviousStockValue) ||
            isNaN(parsedLevelValue) ||
            isNaN(parsedPreviousLevelValue) ||
            parsedStockValue <= parsedPreviousStockValue || 
            parsedLevelValue <= parsedPreviousLevelValue
          ) {
            alert("Invalid or inconsistent values detected. Please ensure each row's values are greater than the previous row's values.");
            return false;
          }
          break;
        }
        j--;
      }
    }
  
    if (!this.dataExist) {
      alert("Please Check! Data not exists.");
      return false;
    }
  
    return true;
  }
  
  

  saveTank() {
    if (this.newTankForm.valid && this.validateAllRows()) {
      const tableRowsData = this.tableRows.value
        .filter(row => row.level !== null && row.stockValue !== null && row.level !== '' && row.stockValue !== '')
        .map(row => ({
          code: this.newTankForm.get('Code')?.value === "" ? 0 : this.newTankForm.get('Code')?.value,
          tankName: this.newTankForm.get('tankName')?.value,
          tankLevel: row.level,
          stockQty: row.stockValue,
          userMaster_Code: '2'
        }));
  
      if (tableRowsData.length === 0) {
        alert("Please provide valid data in the table rows before saving.");
        return;
      }
  
      this.tankConfigurationService.postTankConfiguration(tableRowsData).subscribe({
        next: (res: any) => {
          let obj=JSON.stringify(res);  
          let responseObject = JSON.parse(obj);
          this.snackBarService.showSuccessMessage(responseObject.Msg);

        },
        error: (err: any) => {
          console.error('Error saving tank configuration:', err);
        }
      });
    } else {
      alert('Form is invalid or row validations failed.');
    }
  }
  
}
