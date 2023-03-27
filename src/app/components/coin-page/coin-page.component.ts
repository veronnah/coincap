import { Component, OnInit } from '@angular/core';
import { CoinsService } from "../../services/coins.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-coin-page',
  templateUrl: './coin-page.component.html',
  styleUrls: ['./coin-page.component.scss']
})
export class CoinPageComponent implements OnInit {
  public coin: any; // TODO: create a type
  public isLoading: boolean = true;

  constructor(
    private coinsService: CoinsService,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: any) => {
      this.getCoinInfo(params.id);
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
