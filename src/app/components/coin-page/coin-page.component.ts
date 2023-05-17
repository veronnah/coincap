import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CoinsService } from "../../services/coins.service";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { ChartComponent } from "ng-apexcharts";
import { ChartOptionsModel } from "../../models/chartOptions.model";
import { ITradingViewWidget, Themes } from "angular-tradingview-widget";
import { AutoDestroyService } from "../../services/auto-destroy.service";
import { takeUntil } from "rxjs";
import { MatTabChangeEvent } from "@angular/material/tabs";
import { MarketDataModel } from "../../models/marketData.model";
import { CoinDetailsModel } from "../../models/coinDetails.model";
import { CommonService } from "../../services/common.service";
import { DarkModeService } from "angular-dark-mode";
import { chartOptions } from "../../../assets/properties/chart-options";

@Component({
  selector: 'app-coin-page',
  templateUrl: './coin-page.component.html',
  styleUrls: ['./coin-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CoinPageComponent implements OnInit {
  @ViewChild("chart", {static: false}) chart: ChartComponent;

  public coin: CoinDetailsModel;
  public priceRangeValue: number;
  public coinAPIid: string;
  public coinDescription: string;
  public isApiIdCopiedToClipboard: boolean;
  public isUrlCopiedToClipboard: boolean;
  public isCoinInfoLoading: boolean = true;
  public initialDate: Date = new Date();
  public isChartDataLoading: boolean = true;
  public currentTab: string = 'Price';
  public coinQuantity: number;
  public currencyQuantity: number;
  public currentUrl: string;
  public currentCurrency: string;
  public currentCurrencyKey: string;
  public isDarkMode: boolean;
  public chartOptions: Partial<ChartOptionsModel> = chartOptions;
  public activeOptionButton: string;
  public currentCoinId: string;
  public widgetConfig: ITradingViewWidget;

  private currentSymbol: string;

  constructor(
    private coinsService: CoinsService,
    private route: ActivatedRoute,
    private router: Router,
    private destroy$: AutoDestroyService,
    private commonService: CommonService,
    public darkModeService: DarkModeService,
  ) {
  }

  ngOnInit(): void {
    this.setCurrentUrl();
    this.getCurrentCurrency();
    this.listenToThemeChange();
  }

  private listenToThemeChange(): void {
    this.darkModeService.darkMode$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (darkModeEnabled: boolean) => {
          this.isDarkMode = darkModeEnabled;
          this.setWidgetConfig();
          this.chartOptions.grid = {
            borderColor: this.isDarkMode ? '#494949' : '#eeeeee',
          }
        }
      });
  }

  private getCurrentCurrency(): void {
    this.commonService.currentCurrency$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (value: string) => {
          this.currentCurrency = value.toUpperCase();
          this.currentCurrencyKey = value;
          this.getCurrentCoinId();
        }
      });
  }

  private setCurrentUrl(): void {
    this.currentUrl = window.location.href;
  }

  private getCurrentCoinId(): void {
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe((params: Params) => {
        this.currentCoinId = params.id;
        this.getCoinInfo(this.currentCoinId);
        this.getChartData('1');
      });
  }

  public initChart(data: number[]): void {
    this.chartOptions.series = [
      {
        name: 'Price',
        data: data,
      }
    ];
  }

  public setChart(tabEvent: MatTabChangeEvent): void {
    this.currentTab = tabEvent.tab.textLabel;
    this.coin.symbol === 'usdt' ? this.currentSymbol = 'CRYPTOCAP:USDT' : this.currentSymbol = `BINANCE:${this.coin.symbol}USDT`;

    if (this.currentTab === 'Price') {
      this.getChartData('1');
    } else {
      this.setWidgetConfig();
    }
  }

  private setWidgetConfig(): void {
    this.widgetConfig = {
      widgetType: 'widget',
      theme: this.isDarkMode ? Themes.DARK : Themes.LIGHT || 'Light',
      symbol: this.currentSymbol,
      range: '1d',
      interval: "60",
      allow_symbol_change: true,
      width: 962,
    };
  }

  public getChartData(days: string): void {
    this.activeOptionButton = days;
    this.coinsService.getMarketData(this.currentCoinId, days, this.currentCurrency)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result: MarketDataModel) => {
          this.initChart(result.prices);
          this.isChartDataLoading = false;
        },
        error: () => {
          this.isChartDataLoading = false;
        }
      });
  }

  public getCoinInfo(coinId: string): void {
    this.coinsService.getCoin(coinId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (coin: CoinDetailsModel) => {
          this.priceRangeValue = (coin.market_data.current_price[this.currentCurrencyKey] - coin.market_data.low_24h[this.currentCurrencyKey])
            / (coin.market_data.high_24h[this.currentCurrencyKey] - coin.market_data.low_24h[this.currentCurrencyKey]) * 100;
          this.coin = coin;
          this.coinAPIid = coin.id;
          this.coinDescription = coin.description.en.split('<a').join('<a target="_blank"');
          this.isCoinInfoLoading = false;
        },
        error: () => {
          this.isCoinInfoLoading = false;
        }
      });
  }

  public convert(value: string, currencyType: string): void {
    switch (currencyType) {
      case 'crypto':
        this.currencyQuantity = +value * this.coin.market_data.current_price[this.currentCurrencyKey];
        break;
      case 'fiat':
        this.coinQuantity = +value / this.coin.market_data.current_price[this.currentCurrencyKey];
        break;
    }
  }

  public copyToClipboard(content: string, event?: MouseEvent): void {
    if (content === 'url') {
      this.isUrlCopiedToClipboard = true;
      event?.stopPropagation();

      setTimeout(() => {
        this.isUrlCopiedToClipboard = false;
      }, 5000);
    } else if (content === 'apiId') {
      this.isApiIdCopiedToClipboard = true;

      setTimeout(() => {
        this.isApiIdCopiedToClipboard = false;
      }, 5000);
    }
  }

}
