import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UomService } from 'src/app/services/Master/uom.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonCloseDirective, ButtonDirective, ModalBodyComponent, ModalComponent, ModalFooterComponent, ModalHeaderComponent, ModalTitleDirective, ThemeDirective } from '@coreui/angular';
import { DeleteConfermationPopUpComponent } from '../../../pop-up/delete-confermation/delete-confermation-pop-up/delete-confermation-pop-up.component';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-uom',
  standalone: true,
  imports: [HttpClientModule, ReactiveFormsModule, CommonModule, ButtonDirective, ModalComponent,
    ModalHeaderComponent, ModalTitleDirective, ThemeDirective, ButtonCloseDirective, ModalBodyComponent,
    ModalFooterComponent, DeleteConfermationPopUpComponent],
  templateUrl: './uom.component.html',
  styleUrls: ['./uom.component.scss'],
  providers: [UomService]
})
export class UomComponent implements OnInit {
  UOM: any = [];
  newUOMForm: FormGroup;
  dataSource: MatTableDataSource<any>;
  getGSTUOMList: any = [];

  constructor(private _UomService: UomService, private fb: FormBuilder, private dialog: MatDialog) { }

  public visible = false;
  public visible1 = false;

  toggleLiveDemo() {
    this.visible = !this.visible;
    if (!this.visible) {
      this.newUOMForm.reset({ Code: 0 });
    }
    this.ClearData();
  }
  editDemoModal() {
    this.visible1 = !this.visible1;
    this.newUOMForm.reset();
  }

  handleLiveDemoChange(event: any) {
    this.visible = event;
  }
  // handleEditDemoChange(event: any) {
  //   this.visible1 = event;
  // }

  ngOnInit() {
    this.UOMList();
    this.gstuomDesp();
    this.newUOMForm = this.fb.group({
      Code: ['', Validators.required],
      uomdesp: ['', Validators.required],
      gstuomDesp: [''],
      DigitsAfterDecimal: ['', Validators.required],
    });
  }

  UOMList() {
    this._UomService.getUOM().subscribe(res => {
      this.UOM = res.sort((a, b) => a.UOM.localeCompare(b.UOM));
      console.log(this.UOM);
    });
  }
  gstuomDesp() {
    const obj = {
      tableName: "GSTUOMMaster",
      fieldName: "Description",
      fieldNameOrderBy: "Description",
      distinct: "",
      filterCondition: " And Description<>''"
    };
    this._UomService.getGSTUOMDesp(obj).subscribe(res => {
      this.getGSTUOMList = res;
    });
  }

  saveUOM() {
    let obj = {
      code: this.newUOMForm.get('Code').value == "" ? '0' : this.newUOMForm.get('Code').value,
      uom: this.newUOMForm.value.uomdesp,
      gstuom: this.newUOMForm.value.gstuomDesp,
      decimalPoints: this.newUOMForm.value.DigitsAfterDecimal,
      UserMaster_Code: 141,
    };
    console.log(obj);

    this._UomService.postUOM(obj).subscribe({
      next: (res: any) => {
        let obj = JSON.stringify(res);
        let responseObject = JSON.parse(obj);
        if (responseObject.Msg == 'Data updated successfully.') {
          this.editDemoModal();
          // this.ClearData();
          alert(responseObject.Msg);
        }
        else {
          this.toggleLiveDemo();
          // this.ClearData();
          alert(responseObject.Msg);
        }
        this.UOMList();
      },
    });
  }

                                           //  Special Character Validation 
  onInputChange(event: any) {
    const inputValue: string = event.target.value;
    const newValue = inputValue.replace(/[^0-9]/g, ''); // Remove non-numeric characters
    this.newUOMForm.get('DigitsAfterDecimal').setValue(newValue.slice(0, 1)); // Limit input to 3 characters
  }

  onInputCharacterChange(event: any) {
    const characterInputValue: string = event.target.value;
    const newValue = characterInputValue.replace(/[^a-zA-Z]/g, ''); // Remove non-alphabetical characters
    this.newUOMForm.get('uomdesp').setValue(newValue);
  }

                                              // Update Data
  editData(Code: number) {
    this.editDemoModal();
    this._UomService.editUOM(Code).subscribe(res => {
      this.newUOMForm.patchValue({
        Code: res.Code,
        uomdesp: res.UOM,
        gstuomDesp: res.GSTUOM,
        DigitsAfterDecimal: res.DecimalPoints,
      })

    })
  }

  deleteData(code: any): void {
    const dialogRef = this.dialog.open(DeleteConfermationPopUpComponent, {
      width: '375px',
      data: { message: 'Are you sure you want to delete this followUp?', code: code }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let reason = result.reason;
        this._UomService.deleteUOM(code, reason).subscribe({
          next: (result) => {
            let responseObject = result; // No need to JSON.stringify and then JSON.parse
            alert(responseObject.Msg);
            this.UOMList();
          },
          error: (err) => {
            console.log(err);
            alert('An error occurred while deleting the record.');
          }
        });
      }
    }
    )
  }
  ClearData() {
    this.newUOMForm.patchValue({
      Code: '0',
      uomdesp: '',
      gstuomDesp: '',
      DigitsAfterDecimal: '',
    })
  }
}
