import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LemburPage } from './lembur.page';

const routes: Routes = [
  {
    path: '',
    component: LemburPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LemburPageRoutingModule {}
