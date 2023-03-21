import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, Sort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { LiveAnnouncer } from "@angular/cdk/a11y";
import { HttpErrorResponse } from "@angular/common/http";
import { CoinsService } from "../../../services/coins.service";
import { map } from "rxjs";
import { CoinModel } from "../../../models/coin.model";

@Component({
  selector: 'app-coin-list-table',
  templateUrl: './coin-list-table.component.html',
  styleUrls: ['./coin-list-table.component.scss']
})
export class CoinListTableComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;

  public displayedColumns: string[] = [
    'market_cap_rank',
    'name',
    'current_price',
    'price_change_percentage_1h_in_currency',
    'price_change_percentage_24h',
    'price_change_percentage_14d_in_currency',
    'total_volume'];
  public coinsList: CoinModel[];
  public dataSource: MatTableDataSource<CoinModel>;
  public isLoading: boolean = true;

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private coinsService: CoinsService,
  ) {
  }

  ngOnInit(): void {
    this.getCoins();
  }

  public getCoins(): void {
    this.coinsService.getCoinsList()
      .pipe(map((result: CoinModel[]) => {
          return result.map((coin: CoinModel) => {
            return {
              market_cap_rank: coin.market_cap_rank,
              image: coin.image,
              name: coin.name,
              current_price: coin.current_price,
              price_change_percentage_1h_in_currency: coin.price_change_percentage_1h_in_currency,
              price_change_percentage_24h: coin.price_change_percentage_24h,
              price_change_percentage_14d_in_currency: coin.price_change_percentage_14d_in_currency / 2,
              total_volume: coin.total_volume,
            }
          });
        }
      )).subscribe({
      next: (result: CoinModel[]) => {
        console.log(result)
        this.coinsList = result;
        this.dataSource = new MatTableDataSource(this.coinsList);
        this.dataSource.sort = this.sort;
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading = false;
      }
    });
  }

  /** Announce the change in sort state for assistive technology. */
  public announceSortChange(sortState: Sort): void {
    console.log(sortState)
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

}
