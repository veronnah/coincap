import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { map, Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { CoinModel } from "../models/coin.model";
import { CoinDetailsModel } from "../models/coinDetails.model";
import { MarketDataModel } from "../models/marketData.model";
import { SearchCoinsModel } from "../models/searchCoins.model";

@Injectable({
  providedIn: 'root'
})
export class CoinsService {

  constructor(private http: HttpClient) {
  }

  public getCoinsList(pageNumber: number, currency: string): Observable<CoinModel[]> {
    let httpParams = new HttpParams();
    httpParams = httpParams.append('vs_currency', currency);
    httpParams = httpParams.append('order', 'market_cap_desc');
    httpParams = httpParams.append('per_page', '20');
    httpParams = httpParams.append('page', pageNumber);
    httpParams = httpParams.append('sparkline', 'true');
    httpParams = httpParams.append('price_change_percentage', '1h,24h,7d,14d');

    return this.http.get<CoinModel[]>(
      `${environment.apiUrl}/coins/markets`, {params: httpParams})
      .pipe(map((result: CoinModel[]) => {
          return result.map((coin: CoinModel) => {
            return {
              id: coin.id,
              market_cap_rank: coin.market_cap_rank,
              image: coin.image,
              name: coin.name,
              symbol: coin.symbol,
              current_price: coin.current_price,
              price_change_percentage_1h_in_currency: coin.price_change_percentage_1h_in_currency,
              price_change_percentage_24h: coin.price_change_percentage_24h,
              price_change_percentage_14d_in_currency: coin.price_change_percentage_14d_in_currency / 2,
              total_volume: coin.total_volume,
              sparkline_in_7d: coin.sparkline_in_7d,
            }
          });
        }
      ));
  }

  public getCoin(id: string): Observable<CoinDetailsModel> {
    return this.http.get<CoinDetailsModel>(`${environment.apiUrl}/coins/${id}`);
  }

  public searchCoins(searchValue: string): Observable<SearchCoinsModel> {
    let httpParams = new HttpParams();
    httpParams = httpParams.append('query', searchValue);
    return this.http.get<SearchCoinsModel>(`${environment.apiUrl}/search`, {params: httpParams});
  }

  public getMarketData(coinId: string, days: string | undefined, currency: string): Observable<MarketDataModel> {
    let httpParams = new HttpParams();
    httpParams = httpParams.append('vs_currency', currency);
    httpParams = httpParams.append('days', days!);
    return this.http.get<MarketDataModel>(`${environment.apiUrl}/coins/${coinId}/market_chart`, {params: httpParams});
  }
}
