import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { CoinModel } from "../models/coin.model";

@Injectable({
  providedIn: 'root'
})
export class CoinsService {

  constructor(private http: HttpClient) {
  }

  public getCoinsList(pageNumber: number): Observable<CoinModel[]> {
    return this.http.get<CoinModel[]>(
      `${environment.apiUrl}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=${pageNumber}&sparkline=true&price_change_percentage=1h%2C%2024h%2C%207d%2C14d`);
  }

  public getCoin(id: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/coins/${id}`);
  }

  public getMarketData(coinId: string, days: string | undefined): Observable<any> {
    return this.http.get(`${environment.apiUrl}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`);
  }
}
