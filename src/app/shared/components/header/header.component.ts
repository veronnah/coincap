import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonService } from "../../../services/common.service";
import { takeUntil } from "rxjs";
import { AutoDestroyService } from "../../../services/auto-destroy.service";
import { ThemeService } from "../../../services/theme.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent implements OnInit {
  public currencies: string[];

  constructor(
    public commonService: CommonService,
    private destroy$: AutoDestroyService,
    public themeService: ThemeService,
  ) {
  }

  ngOnInit(): void {
    this.getCurrencies();
    this.getCurrentCurrency();
    this.themeService.setTheme();
  }

  public getCurrencies(): void {
    this.commonService.getCurrencies()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result: string[]) => {
          this.currencies = result;
        }
      });
  }

  public getCurrentCurrency(): void {
    this.commonService.currentCurrency$.next(localStorage.getItem('currency') || 'usd');
  }

  public changeCurrency(currency: string): void {
    this.commonService.currentCurrency$.next(currency);
    localStorage.setItem('currency', currency);
  }

}
