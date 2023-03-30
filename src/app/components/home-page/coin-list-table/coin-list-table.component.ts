import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, Sort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { LiveAnnouncer } from "@angular/cdk/a11y";
import { CoinsService } from "../../../services/coins.service";
import { map, takeUntil } from "rxjs";
import { CoinModel } from "../../../models/coin.model";
import { MatPaginator } from "@angular/material/paginator";
import { ChartOptionsModel } from "../../../models/chartOptions.model";
import { Router } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";
import { AutoDestroyService } from "../../../services/auto-destroy.service";

declare global {
  interface Window {
    Apex: ChartOptionsModel;
  }
}

@Component({
  selector: 'app-coin-list-table',
  templateUrl: './coin-list-table.component.html',
  styleUrls: ['./coin-list-table.component.scss']
})
export class CoinListTableComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public displayedColumns: string[] = [
    'market_cap_rank',
    'name',
    'current_price',
    'price_change_percentage_1h_in_currency',
    'price_change_percentage_24h',
    'price_change_percentage_14d_in_currency',
    'total_volume',
    'sparkline_in_7d',
  ];
  public coinsList: CoinModel[];
  public dataSource: MatTableDataSource<CoinModel>;
  public clickedRows: Set<CoinModel> = new Set<CoinModel>();
  public currentPage: number = 1;
  public searchValue: string = '';
  public isLoading: boolean = true;

  public commonLineSparklineOptions: Partial<ChartOptionsModel> = {
    chart: {
      type: "line",
      width: 135,
      height: 50,
      animations: {
        enabled: false,
      },
      sparkline: {
        enabled: true,
      }
    },
    tooltip: {
      fixed: {
        enabled: false,
      },
      x: {
        show: false,
      },
      y: {
        title: {
          formatter: (seriesName: string) => {
            return "";
          }
        }
      },
      marker: {
        show: false
      }
    }
  };

  constructor(
    private liveAnnouncer: LiveAnnouncer,
    private coinsService: CoinsService,
    private router: Router,
    private destroy$: AutoDestroyService,
  ) {
    window.Apex = {
      stroke: {
        width: 2,
      },
      markers: {
        size: 0,
      },
      tooltip: {
        fixed: {
          enabled: true,
        }
      }
    };
  }

  ngOnInit(): void {
    this.getCoins(this.currentPage);
  }

  public getCoins(pageNumber: number): void {
    this.isLoading = true;
    this.searchValue = '';

    this.coinsService.getCoinsList(pageNumber)
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
      )).pipe(takeUntil(this.destroy$))
      .subscribe({
      next: (result: CoinModel[]) => {
        this.coinsList = result;
        console.log(result)

        this.coinsList.forEach((coin: CoinModel) => {
          let color: string[];
          coin.price_change_percentage_14d_in_currency >= 0 ? color = ['#57BD0F'] : color = ['#ED5565'];

          return coin.chartOptions = {
            series: [
              {
                data: coin.sparkline_in_7d.price,
              }
            ],
            colors: color,
          }
        });

        this.dataSource = new MatTableDataSource(this.coinsList);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  public filterCoins(): void {
    const filteredCoins = this.coinsList.filter((coin: CoinModel) => {
      return coin.name.trim().toLowerCase().includes(this.searchValue.trim().toLowerCase())
        || coin.symbol.trim().toLowerCase().includes(this.searchValue.trim().toLowerCase());
    });

    this.dataSource = new MatTableDataSource(filteredCoins);
    this.dataSource.sort = this.sort;
  }

  public onRowClick(row: CoinModel): void {
    this.clickedRows.add(row);
    this.router.navigate(['coins', row.id]).then();
  }

  public announceSortChange(sortState: Sort): void {
    if (sortState.direction) {
      this.liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this.liveAnnouncer.announce('Sorting cleared');
    }
  }

}
