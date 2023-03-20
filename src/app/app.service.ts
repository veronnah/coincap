import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private http: HttpClient) { }

  getCoinsList() {
    const headers = new HttpHeaders()
      .set('X-CoinAPI-Key', '997A0A8C-DBF0-4086-B9DD-E1F33824CFBF');

    this.http.get(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false`)
      .subscribe(res => {
        console.log(res)
      });
  }
}
