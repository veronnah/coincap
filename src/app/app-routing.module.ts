import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from "./components/home-page/home-page.component";
import { CoinPageComponent } from "./components/coin-page/coin-page.component";
import { PageNotFoundComponent } from "./components/page-not-found/page-not-found.component";

const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'coins/:id', component: CoinPageComponent },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
