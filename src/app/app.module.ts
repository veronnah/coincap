import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { HeaderComponent } from "./components/header/header.component";
import { HomePageComponent } from "./components/home-page/home-page.component";
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { CoinListTableComponent } from './components/home-page/coin-list-table/coin-list-table.component';
import { MatTableModule } from "@angular/material/table";
import { MatSortModule } from "@angular/material/sort";
import { LoaderComponent } from "./shared/components/loader/loader.component";
import { NgApexchartsModule } from "ng-apexcharts";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { FormsModule } from "@angular/forms";
import { PaginationComponent } from './shared/components/pagination/pagination.component';
import { MatTooltipModule } from "@angular/material/tooltip";
import { ScrollToTopComponent } from './shared/components/scroll-to-top/scroll-to-top.component';
import { CoinPageComponent } from './components/coin-page/coin-page.component';
import { AbsPipe } from './shared/pipes/abs.pipe';
import { MatTabsModule } from "@angular/material/tabs";
import { TradingviewWidgetModule } from "angular-tradingview-widget";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { ErrorInterceptor } from "./shared/interceptors/error.interceptor";
import { UrlMiddlePartPipe } from './shared/pipes/url-middle-part.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomePageComponent,
    CoinListTableComponent,
    LoaderComponent,
    PaginationComponent,
    ScrollToTopComponent,
    CoinPageComponent,
    AbsPipe,
    UrlMiddlePartPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatSortModule,
    NgApexchartsModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatTooltipModule,
    MatTabsModule,
    TradingviewWidgetModule,
    MatSnackBarModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
