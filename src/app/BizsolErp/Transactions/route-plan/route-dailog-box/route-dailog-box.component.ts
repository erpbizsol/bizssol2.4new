import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-route-dailog-box',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule,ReactiveFormsModule,CommonModule],
  templateUrl: './route-dailog-box.component.html',
  styleUrl: './route-dailog-box.component.scss'
})
export class RouteDailogBoxComponent {
  routePlanForm:FormGroup;

  constructor(){}

  ngOnInit(){
    this.routePlanForm=new FormGroup({
      visitType:new FormControl(),
      dealerName:new FormControl(),
      city:new FormControl(),
      state:new FormControl(),
      description:new FormControl(),
    })
  }
  registerRP(formdata: FormGroup) {
    console.log(formdata.value);
  }
}
