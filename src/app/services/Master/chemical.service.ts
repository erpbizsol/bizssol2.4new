import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { UrlService } from '../URL/url.service';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ChemicalService {

  constructor(private _http:HttpClient,private _urlService:UrlService) { }

  private headers=new HttpHeaders({
    'Content-Type': 'application/json; charset=utf-8',
  })
}
