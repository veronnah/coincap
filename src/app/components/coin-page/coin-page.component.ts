import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CoinsService } from "../../services/coins.service";
import { ActivatedRoute, Params } from "@angular/router";
import { ChartComponent } from "ng-apexcharts";
import { ChartOptionsModel } from "../../models/chartOptions.model";
import { ITradingViewWidget, Themes } from "angular-tradingview-widget";
import { AutoDestroyService } from "../../services/auto-destroy.service";
import { takeUntil } from "rxjs";
import { MatTabChangeEvent } from "@angular/material/tabs";
import { MarketDataModel } from "../../models/marketData.model";
import { CoinDetailsModel } from "../../models/coinDetails.model";

@Component({
  selector: 'app-coin-page',
  templateUrl: './coin-page.component.html',
  styleUrls: ['./coin-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CoinPageComponent implements OnInit {
  public coin: CoinDetailsModel;
  public isCoinInfoLoading: boolean = true;
  public initialDate: Date = new Date();
  public isChartDataLoading: boolean = true;
  public currentTab: string;

  @ViewChild("chart", {static: false}) chart: ChartComponent;
  public chartOptions: Partial<ChartOptionsModel>;
  public activeOptionButton: string;
  public currentCoinId: string;
  public widgetConfig: ITradingViewWidget;

  constructor(
    private coinsService: CoinsService,
    private route: ActivatedRoute,
    private destroy$: AutoDestroyService,
  ) {
  }

  ngOnInit(): void {
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe((params: Params) => {
        this.currentCoinId = params.id;

        this.getCoinInfo(this.currentCoinId);
        this.getChartData('1');
      });
  }

  public initChart(data: number[]): void {
    this.chartOptions = {
      series: [
        {
          name: 'Price',
          data: data,
        }
      ],
      colors: ['#57BD0F'],
      chart: {
        type: "area",
        height: 500,
        fontFamily: 'Solway, sans-serif',
        animations: {
          enabled: false,
        },
        toolbar: {
          show: true,
          offsetX: 0,
          offsetY: 0,
          tools: {
            download: `<img src="./assets/img/download.svg" width="16" alt="Download">`,
            selection: true,
            zoom: `<img src="./assets/img/selection.svg" width="16" alt="Selection zoom">`,
            zoomin: `<img src="./assets/img/zoom-in.svg" width="20" alt="Zoom in">`,
            zoomout: `<img src="./assets/img/zoom-out.svg" width="20" alt="Zoom out">`,
            pan: false,
            reset: `<img src="./assets/img/reset.svg" width="16" alt="Reset">`,
            customIcons: [],
          },
          autoSelected: 'zoom'
        },
      },
      grid: {
        show: true,
        borderColor: '#f3f3f3',
        xaxis: {
          lines: {
            show: false,
          }
        },
        yaxis: {
          lines: {
            show: true,
          }
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        width: 2,
      },
      markers: {
        size: 0,
      },
      xaxis: {
        type: "datetime",
        tickAmount: 6,
      },
      yaxis: {
        labels: {
          formatter: function (value: number) {
            return "$" + value;
          },
        },
      },
      tooltip: {
        enabled: true,
        intersect: false,
        followCursor: false,
        fixed: {
          enabled: false,
        },
        x: {
          format: 'dd MMM yyyy',
        }
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.9,
          stops: [0, 100]
        }
      },
    };
  }

  public setChart(tabEvent: MatTabChangeEvent): void {
    this.currentTab = tabEvent.tab.textLabel;

    if (this.currentTab === 'Price') {
      this.getChartData('1');
    } else if (this.currentTab === 'TradingView') {
      this.widgetConfig = {
        widgetType: 'widget',
        theme: Themes.LIGHT,
        symbol: 'BITSTAMP:BTCUSD',
        range: '1d',
        interval: "60",
        allow_symbol_change: true,
        width: 700,
      };
    }
  }

  public getChartData(days: string): void {
    this.activeOptionButton = days;

    this.coinsService.getMarketData(this.currentCoinId, days)
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
          this.coin = coin;
          this.isCoinInfoLoading = false;
        },
        error: () => {
          this.isCoinInfoLoading = false;
        }
      });
  }

}
