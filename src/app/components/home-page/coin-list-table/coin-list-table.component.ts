import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, Sort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { LiveAnnouncer } from "@angular/cdk/a11y";
import { CoinsService } from "../../../services/coins.service";
import { debounceTime, Subject, takeUntil } from "rxjs";
import { CoinModel } from "../../../models/coin.model";
import { MatPaginator } from "@angular/material/paginator";
import { ChartOptionsModel } from "../../../models/chartOptions.model";
import { Router } from "@angular/router";
import { AutoDestroyService } from "../../../services/auto-destroy.service";
import { SearchCoinsModel } from "../../../models/searchCoins.model";
import { CommonService } from "../../../services/common.service";
import { MatCheckboxChange } from "@angular/material/checkbox";

declare global {
  interface Window {
    Apex: ChartOptionsModel;
  }
}

const ALL_COLUMNS = [
  'market_cap_rank',
  'name',
  'current_price',
  'price_change_percentage_1h_in_currency',
  'price_change_percentage_24h',
  'price_change_percentage_14d_in_currency',
  'total_volume',
  'sparkline_in_7d',
];

@Component({
  selector: 'app-coin-list-table',
  templateUrl: './coin-list-table.component.html',
  styleUrls: ['./coin-list-table.component.scss']
})
export class CoinListTableComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public displayedColumns: string[] = ALL_COLUMNS;
  public coinsList: CoinModel[];
  public favoriteCoins: CoinModel[];
  public isFavoritesShown: boolean;
  public dataSource: MatTableDataSource<CoinModel>;
  public clickedRows: Set<CoinModel> = new Set<CoinModel>();
  public currentPage: number = 1;
  public searchValue: string = '';
  public isLoading: boolean = true;
  public onSearchModelChange: Subject<void> = new Subject<void>();
  public searchResults: CoinModel[] = [];
  public currentCurrency: string;

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
    private commonService: CommonService,
  ) {
    this.initApexChart();
  }

  ngOnInit(): void {
    this.getCurrentCurrency();
    this.searchModelChangeListener();
    this.getFavoriteCoins();
  }

  public getCurrentCurrency(): void {
    this.commonService.currentCurrency$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (value: string) => {
          this.currentCurrency = value.toUpperCase();
          this.getCoins(this.currentPage);
        }
      });
  }

  public getCoins(pageNumber: number): void {
    this.isLoading = true;
    this.currentPage = pageNumber;
    this.searchValue = '';

    this.coinsService.getCoinsList(pageNumber, this.currentCurrency)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result: CoinModel[]) => {
          this.coinsList = result;
          this.setSparklineData();
          this.dataSource = new MatTableDataSource(this.coinsList);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          this.isLoading = false;
          this.addFavoriteField(this.coinsList);
        },
        error: () => {
          this.isLoading = false;
        }
      });
  }

  private addFavoriteField(list: CoinModel[]): void {
    list?.map((coin: CoinModel) => {
      return coin.isFavorite = this.favoriteCoins.some((favCoin: CoinModel) => favCoin.id === coin.id);
    });
  }

  private setSparklineData(): void {
    this.coinsList.forEach((coin: CoinModel) => {
      let color: string[];
      coin.price_change_percentage_14d_in_currency >= 0 ? color = ['#57BD0F'] : color = ['#ED5565'];
      coin.chartOptions = {
        series: [
          {
            data: coin.sparkline_in_7d.price,
          }
        ],
        colors: color,
      }
    });
  }

  public searchModelChangeListener(): void {
    this.onSearchModelChange
      .pipe(debounceTime(500), takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.searchCoins();
        }
      });
  }

  public searchCoins(): void {
    if (this.searchValue) {
      this.isLoading = true;
      this.displayedColumns = [
        'market_cap_rank',
        'name',
      ];
      this.coinsService.searchCoins(this.searchValue)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (result: SearchCoinsModel) => {
            this.searchResults = result.coins;
            this.addFavoriteField(this.searchResults);
            this.dataSource.data = this.searchResults;
            this.dataSource.sort = this.sort;
            this.isLoading = false;
          },
          error: () => {
            this.isLoading = false;
            this.setDefaultColumns();
          }
        });
    } else {
      this.setDefaultColumns();
    }
  }

  private setDefaultColumns(): void {
    this.displayedColumns = ALL_COLUMNS;
    this.dataSource = new MatTableDataSource(this.coinsList);
    this.dataSource.sort = this.sort;
  }
  private setFavoriteColumns(): void {
    this.displayedColumns = [
      'market_cap_rank',
      'name',
    ];
    this.dataSource.data = this.favoriteCoins;
    this.dataSource.sort = this.sort;
  }

  public onRowClick(row: CoinModel): void {
    this.clickedRows.add(row);
    void this.router.navigate(['coins', row.id]);
  }

  public addToFavorite(coin: CoinModel, event: MouseEvent): void {
    event.stopPropagation();
    const coinIdx = this.favoriteCoins.findIndex((favCoin: CoinModel) => favCoin.id === coin.id);
    if (coinIdx >= 0) {
      this.favoriteCoins.splice(coinIdx, 1);
    } else {
      this.favoriteCoins.push(coin);
    }
    this.addFavoriteField(this.favoriteCoins);
    this.addFavoriteField(this.coinsList);
    this.addFavoriteField(this.searchResults);
    this.setFavoritesToLS();
    if (this.isFavoritesShown) {
      this.setFavoriteColumns();
    }
  }

  public announceSortChange(sortState: Sort): void {
    if (sortState.direction) {
      this.liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this.liveAnnouncer.announce('Sorting cleared');
    }
  }

  public showFavorites(event: MatCheckboxChange): void {
    this.isFavoritesShown = event.checked;
    if (this.isFavoritesShown) {
      this.setFavoriteColumns();
    } else {
      this.setDefaultColumns();
    }
  }

  private getFavoriteCoins(): void {
    const savedCoins = localStorage.getItem('favoriteCoins');
    this.favoriteCoins = savedCoins ? JSON.parse(savedCoins) : [];
  }

  private setFavoritesToLS(): void {
    localStorage.setItem('favoriteCoins', JSON.stringify(this.favoriteCoins));
  }

  private initApexChart(): void {
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

}
