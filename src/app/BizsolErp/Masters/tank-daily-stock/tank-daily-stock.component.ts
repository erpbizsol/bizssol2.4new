import { HttpClientModule } from '@angular/common/http';
import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, FormGroup, FormArray, Validators } from '@angular/forms';
import { TankDailyStockService } from 'src/app/services/Master/tank-daily-stock.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tank-daily-stock',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, CommonModule],
  templateUrl: './tank-daily-stock.component.html',
  styleUrls: ['./tank-daily-stock.component.scss'],
  providers: [TankDailyStockService]
})
export class TankDailyStockComponent implements OnInit {
  @ViewChildren('levelInput') levelInputs!: QueryList<ElementRef>;

  Tank: any = [];
  newtank:string;
  newTankDailyStockForm: FormGroup;
  todayDate: string = new Date().toISOString().slice(0, 10); // Format: YYYY-MM-DD

  constructor(private tankDailyStockService: TankDailyStockService, private fb: FormBuilder) {
    this.newTankDailyStockForm = this.fb.group({
      date: ['', Validators.required],
      Code: ['0'],
      opening: ['', Validators.required],
      purchase: ['', Validators.required],
      consumption: ['', Validators.required],
      dispatch: ['', Validators.required],
      production: ['', Validators.required],
      tableRows: this.fb.array([])
    });
  }

  get tableRows(): FormArray {
    return this.newTankDailyStockForm.get('tableRows') as FormArray;
  }

  addRow() {
    this.tableRows.push(this.fb.group({
      tankName: [{ value: '', disabled: true }, Validators.required],
      level: ['', [Validators.required, Validators.pattern(/^\d+$/)]], // Integer only
      stockValue: [{ value: '', disabled: true }, Validators.required]
    }));
  }

  ngOnInit() {
    this.newTankDailyStockForm.patchValue({ date: this.todayDate });
    this.TankDailyStockList();
    this.newTankDailyStockForm.get('tankName')?.valueChanges.subscribe(() => {
      // this.clearTableRows();
      // this.showTable = false;
    });
  }

  TankDailyStockList() {
    const obj = {
      tableName: "TankMaster",
      fieldName: "Desp",
      fieldNameOrderBy: "Desp",
      distinct: "",
      filterCondition: " And Desp<>''"
    };

    this.tankDailyStockService.getTankMasterDropdownList(obj).subscribe(res => {
      this.Tank = res;
      if (res.length > 0) {
        this.populateTableRows(res);
      }
      console.log(this.Tank.Desp);
    });
  }

  validateInteger(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  onLevelEnter(event: Event, index: number) {
    const keyboardEvent = event as KeyboardEvent;
    if (keyboardEvent.key === 'Enter') {
      keyboardEvent.preventDefault();

      const rows = this.tableRows.controls;
      const currentRow = rows[index] as FormGroup;
      const TankName = (currentRow.get('tankName')?.value);
      const Level = parseFloat(currentRow.get('level')?.value);

      const nextRowIndex = index + 1;
      if (nextRowIndex < this.tableRows.length) { 
        const nextInput = this.levelInputs.toArray()[nextRowIndex].nativeElement;
        nextInput.focus();
        
        this.tankDailyStockService.getCalculateStockQty(TankName, Level).subscribe(res => {
         
        this.newTankDailyStockForm.value.stockValue = res;
        
          console.log(this.newTankDailyStockForm.value.stockValue);
          
        })
        // const levelValue= this.newTankDailyStockForm.value.level.

      } else {
        // this.addRow();
        setTimeout(() => this.focusNewRow(), 0);
      }
    }
  }

  focusNewRow() {
    const inputArray = this.levelInputs.toArray();
    const newRowInput = inputArray[inputArray.length - 1].nativeElement;
    newRowInput.focus();
  }

  populateTableRows(TankData: any[]) {
    TankData.forEach(row => {
      this.tableRows.push(this.fb.group({
        tankName: [{ value: row.Desp, disabled: true }, Validators.required],
        level: ['', Validators.required],
        stockValue: [{ value: row.res, disabled: true }, Validators.required]
      }));
    });
  }

  clearTableRows() {
    while (this.tableRows.length !== 0) {
      this.tableRows.removeAt(0);
    }
  }

  saveTankDailyStock() {
    // let obj = {
    //   code: this.newTankDailyStockForm.get('Code').value == "" ? '0' : this.newTankDailyStockForm.get('Code').value,
    //   date: this.newTankDailyStockForm.value.date,
    //   tankName: this.newTankDailyStockForm.value.tankName,
    //   level: this.newTankDailyStockForm.value.level,
    //   stockValue: this.newTankDailyStockForm.value.stockValue,
    //   opening: this.newTankDailyStockForm.value.opening,
    //   purchase: this.newTankDailyStockForm.value.purchase,
    //   consumption: this.newTankDailyStockForm.value.consumption,
    //   dispatch: this.newTankDailyStockForm.value.dispatch,
    //   production: this.newTankDailyStockForm.value.production,
    //   UserMaster_Code: 141,
    // };
    // console.log(obj);

    // this._TankDailyStockService.postTankDailyStock(obj).subscribe({
    //   next: (res: any) => {
    //     let obj = JSON.stringify(res);
    //     let responseObject = JSON.parse(obj);
    //     alert(responseObject);
    //     this.TankDailyStockList();
    //   },
    // });
  }

  MaxDate() {
    const referenceDate = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('dateInput') as HTMLInputElement;
    dateInput.max = referenceDate;
  }
}
