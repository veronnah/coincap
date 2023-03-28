import { Component, OnInit, ViewChild } from '@angular/core';
import { CoinsService } from "../../services/coins.service";
import { ActivatedRoute } from "@angular/router";
import { ChartComponent } from "ng-apexcharts";
import { ChartOptionsModel } from "../../models/chartOptions.model";

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
  public chartOptions: Partial<any>;
  // public chartOptions: Partial<ChartOptionsModel>;
  public activeOptionButton: string;
  public currentCoinId: string;

  constructor(
    private coinsService: CoinsService,
    private route: ActivatedRoute,
  ) {
  }

  initChart(data: any): void {
    this.chartOptions = {
      series: [
        {
          data: data,
        }
      ],
      colors: ['#57BD0F'],
      chart: {
        type: "area",
        height: 500,
        animations: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        width: 2,
      },
      markers: {
        size: 0
      },
      xaxis: {
        type: "datetime",
        tickAmount: 6,
      },
      yaxis: {
        // floating: true,
        // decimalsInFloat: 2,
      },
      tooltip: {
        x: {
          format: "dd MMM yyyy"
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
      }
    };
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: any) => {
      this.currentCoinId = params.id;

      this.getCoinInfo(this.currentCoinId);
      this.getChartData('1');
    });
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
