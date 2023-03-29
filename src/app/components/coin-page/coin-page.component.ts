import { Component, OnInit, ViewChild } from '@angular/core';
import { CoinsService } from "../../services/coins.service";
import { ActivatedRoute } from "@angular/router";
import { ChartComponent } from "ng-apexcharts";
import { ChartOptionsModel } from "../../models/chartOptions.model";
import { ITradingViewWidget, Themes } from "angular-tradingview-widget";

@Component({
  selector: 'app-coin-page',
  templateUrl: './coin-page.component.html',
  styleUrls: ['./coin-page.component.scss']
})
export class CoinPageComponent implements OnInit {
  public coin: any; // TODO: create a type
  public isLoading: boolean = true;
  public initialDate: Date = new Date();

  @ViewChild("chart", {static: false}) chart: ChartComponent;
  public chartOptions: Partial<ChartOptionsModel>;
  public activeOptionButton: string;
  public currentCoinId: string;
  public widgetConfig: ITradingViewWidget;

  constructor(
    private coinsService: CoinsService,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: any) => {
      this.currentCoinId = params.id;

      this.getCoinInfo(this.currentCoinId);
      this.getChartData('1');
    });
  }

  public initChart(data: any): void {
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
            customIcons: []
          },
          export: {
            csv: {
              filename: undefined,
              columnDelimiter: ',',
              headerCategory: 'category',
              headerValue: 'value',
              dateFormatter(timestamp: any) {
                return new Date(timestamp).toDateString()
              }
            },
            svg: {
              filename: undefined,
            },
            png: {
              filename: undefined,
            }
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

  public setTradingViewWidget(): void {
    this.widgetConfig = {
      widgetType: 'widget',
      theme: Themes.LIGHT,
      symbol: 'BITSTAMP:BTCUSD',
      range: '1d',
      interval: "60",
      allow_symbol_change: true,
    };
  }

  public getChartData(days: string): void {
    this.coinsService.getMarketData(this.currentCoinId, days)
      .subscribe(res => {
        console.log(res.prices)
        this.initChart(res.prices);
      });
  }

  public getCoinInfo(coinId: string): void {
    this.coinsService.getCoin(coinId)
      .subscribe({
        next: coin => {
          this.coin = coin;
          console.log(this.coin)
          console.log(this.coin.market_data)
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        }
      });
  }

}
