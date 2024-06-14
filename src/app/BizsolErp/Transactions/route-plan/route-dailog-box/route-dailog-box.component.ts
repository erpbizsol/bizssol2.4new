import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StateService } from 'src/app/services/Master/state.service';
import { CityService } from 'src/app/services/Master/city.service';

@Component({
  selector: 'app-route-dailog-box',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule,ReactiveFormsModule,CommonModule],
  templateUrl: './route-dailog-box.component.html',
  styleUrl: './route-dailog-box.component.scss'
})
export class RouteDailogBoxComponent {
  [x: string]: any;
  routePlanForm: FormGroup;
  stateList: any;
  cityList:any;


  constructor(
    private state: StateService, private city: CityService) { }

  ngOnInit() {
    this.getState()
    this.routePlanForm = new FormGroup({
      visitType: new FormControl(''),
      dealerName: new FormControl(),
      city: new FormControl(),
      state: new FormControl(),
      description: new FormControl(),

      // this.getState(),
    })
  }


  registerRP() {
    console.log(this.routePlanForm);
  }

  getState() {
    const selectedValue = 'India'
    this.state.getStates(selectedValue).subscribe((res: any) => {
      this.stateList = res;
      console.log(this.stateList);
      // console.log(this.stateList,"hii");
    })
  }

  getCityList(event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.city.getCity(selectedValue).subscribe((res: any) => {
      this['cityList'] = res;
      console.log(this.getCityList);
    });
  }



}
