import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  public currentCurrency$: BehaviorSubject<string> = new BehaviorSubject<string>('usd');

  constructor(private http: HttpClient) { }

  public getCurrencies(): Observable<string[]> {
    return this.http.get<string[]>(`${environment.apiUrl}/simple/supported_vs_currencies`);
  }
}
