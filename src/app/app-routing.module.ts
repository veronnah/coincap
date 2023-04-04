import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from "./components/home-page/home-page.component";
import { CoinPageComponent } from "./components/coin-page/coin-page.component";

const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'coins/:id', component: CoinPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
