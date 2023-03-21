import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CoinsService {

  constructor(private http: HttpClient) {
  }

  public getCoinsList(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=1h%2C%2024h%2C%207d%2C14d`);
  }
}
