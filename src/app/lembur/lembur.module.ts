import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LemburPageRoutingModule } from './lembur-routing.module';

import { LemburPage } from './lembur.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LemburPageRoutingModule
  ],
  declarations: [LemburPage]
})
export class LemburPageModule {}
