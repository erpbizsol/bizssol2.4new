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
  StockQty: any;
  totalStockValue: number = 0;
  newTankDailyStockForm: FormGroup;
  tableRowsData: any[] = [];
  DailyTankStockMaster: any[] = [];
  DailyTankStockTransaction: any[] = [];
  todayDate: string = new Date().toISOString().slice(0, 10); // Format: YYYY-MM-DD

  constructor(private _TankDailyStockService: TankDailyStockService, private fb: FormBuilder) {
    this.newTankDailyStockForm = this.fb.group({
      date: ['', Validators.required],
      Code: ['0'],
      opening: ['0', Validators.required],
      purchase: ['0', Validators.required],
      consumption: ['0', Validators.required],
      dispatch: ['0', Validators.required],
      production: ['0', Validators.required],
      totalStockInHand: ['0', Validators.required],
      tableRows: this.fb.array([])
    });
  }

  get tableRows(): FormArray {
    return this.newTankDailyStockForm.get('tableRows') as FormArray;
  }

  addRow() {
    this.tableRows.push(this.fb.group({
      tankName: [{ value: '', disabled: true }, Validators.required],
      level: ['', [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]], // Integer or float
      stockValue: [{ value: '', disabled: true }, Validators.required]
    }));
  }

  ngOnInit() {
    this.newTankDailyStockForm.patchValue({ date: this.todayDate });
    this.getDailyTankStockMasterByDate();
    // this.newTankDailyStockForm.get('tankName')?.valueChanges.subscribe(() => {

    // });
  }

  TankDailyStockList() {
    const obj = {
      tableName: "TankMaster",
      fieldName: "Desp",
      fieldNameOrderBy: "Desp",
      distinct: "",
      filterCondition: " And Desp<>''"
    };

    this._TankDailyStockService.getTankMasterDropdownList(obj).subscribe(res => {
      this.Tank = res;
      if (res.length > 0) {
        this.populateTableRows(res);
      }
      console.log(this.Tank.Desp);
    });
  }

  validateFloat(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    if ((charCode < 48 || charCode > 57) && charCode !== 46) {
      event.preventDefault();
    }
  }

  onLevelEnter(event: Event, index: number) {
    const keyboardEvent = event as KeyboardEvent;
    if (keyboardEvent.key === 'Enter') {
      keyboardEvent.preventDefault();

      const rows = this.tableRows.controls;
      const currentRow = rows[index] as FormGroup;
      const tankName = currentRow.get('tankName')?.value;
      const level = parseFloat(currentRow.get('level')?.value);

      const nextRowIndex = index + 1;
      if (nextRowIndex < this.tableRows.length) {
        const nextInput = this.levelInputs.toArray()[nextRowIndex].nativeElement;
        nextInput.focus();
      } else {
        setTimeout(() => this.focusNewRow(), 0);
      }

      this._TankDailyStockService.getCalculateStockQty(tankName, level).subscribe(res => {
        // Assuming res is the stock quantity
        currentRow.get('stockValue')?.setValue(res);
        this.updateTotalStockValue();
        console.log(res);
      });
    }
  }

  onPurchaseEnter(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    if (keyboardEvent.key === 'Enter') {
      keyboardEvent.preventDefault();
      this.calculateConsumption();
      this.calculateProduction();
    }
  }

  updateTotalStockValue() {
    const rows = this.tableRows.controls;
    let total = 0;
    rows.forEach(row => {
      const stockValue = parseFloat(row.get('stockValue')?.value) || 0;
      total += stockValue;
    });
    this.totalStockValue = total;
  }

  calculateConsumption() {
    const opening = parseFloat(this.newTankDailyStockForm.get('opening')?.value) || 0;
    const purchase = parseFloat(this.newTankDailyStockForm.get('purchase')?.value) || 0;
    const consumption = opening + purchase - this.totalStockValue;
    this.newTankDailyStockForm.get('consumption')?.setValue(consumption.toFixed(2));
  }

  calculateProduction() {
    const consumption = parseFloat(this.newTankDailyStockForm.get('consumption')?.value) || 0;
    const dispatch = parseFloat(this.newTankDailyStockForm.get('dispatch')?.value) || 0;
    const production = consumption - dispatch;
    this.newTankDailyStockForm.get('production')?.setValue(production);
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

  populatedailyTankStockMaster(DailyTankStockMaster: any) {
    this.newTankDailyStockForm.patchValue({
      date:DailyTankStockMaster[0].EntryDate,
      Code: DailyTankStockMaster[0].Code,
      opening: DailyTankStockMaster[0].Opening,
      purchase: DailyTankStockMaster[0].Purchase,
      consumption: DailyTankStockMaster[0].Consumption,
      dispatch: DailyTankStockMaster[0].Dispatch,
      production: DailyTankStockMaster[0].Production,
      totalStockInHand: DailyTankStockMaster[0].StockInHand,
    })
  }

  OnChangeDatepopulateTableRows(TankData: any[]) {
    TankData.forEach(row => {
      this.tableRows.push(this.fb.group({
        tankName: [{ value: row.TankName, disabled: true }, Validators.required],
        level: [row.Level, Validators.required],
        stockValue: [{ value: row.Stock, disabled: true }, Validators.required]
      }));
    });
  }

  clearTableRows() {
    while (this.tableRows.length !== 0) {
      this.tableRows.removeAt(0);
    }
  }

  saveTankDailyStock() {
    const formValues = this.newTankDailyStockForm.getRawValue();

    const Obj = {
      dailyTankStockTransaction: formValues.tableRows.map((row: any) => ({
        code: formValues.Code === "" ? '0' : formValues.Code,
        dailyTankStockMaster_Code: 0,
        tankName: row.tankName,
        level: row.level,
        stock: row.stockValue,
      })),
      dailyTankStockMaster: [
        {
          code: formValues.Code === "" ? '0' : formValues.Code,
          entryDate: formValues.date,
          opening: formValues.opening,
          purchase: formValues.purchase,
          consumption: formValues.consumption,
          dispatch: formValues.dispatch,
          production: formValues.production,
          stockInHand: this.totalStockValue,
          UserMaster_Code: 141
        }
      ]
    };

    this._TankDailyStockService.postTankDailyStock(Obj).subscribe({
      next: (res: any) => {
        let obj = JSON.stringify(res);
        let responseObject = JSON.parse(obj);
        alert(responseObject.Msg);
        console.log(res);

      },
      error: (err: any) => {
        console.error('Error saving tank daily stock:', err);
        alert('Failed to save tank daily stock.');
      }
    });
  }

  MaxDate() {
    const referenceDate = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('dateInput') as HTMLInputElement;
    dateInput.max = referenceDate;
  }

  getDailyTankStockMasterByDate() {
    const selectedDate = this.newTankDailyStockForm.get('date')?.value;
    if (selectedDate) {
      this._TankDailyStockService.GetDailyTankStockMasterByDate(selectedDate).subscribe(res => {
        if (res.DailyTankStockTransaction.length > 0 && res.DailyTankStockMaster) {
          this.clearTableRows();
          this.OnChangeDatepopulateTableRows(res.DailyTankStockTransaction);
          this.populatedailyTankStockMaster(res.DailyTankStockMaster[0]);
        }
        else {
          this.clearTableRows();
          this.TankDailyStockList();
        }
      }
      )
    }
  }
}