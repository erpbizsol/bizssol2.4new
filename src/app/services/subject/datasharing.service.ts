import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatasharingService {
  private datasubject=new Subject<any>()



  sendData(data:any){
  this.datasubject.next(data);
  console.log(this.datasubject.next(data)  );
  
  }

  getData(){
  return this.datasubject.asObservable()
  }
}
