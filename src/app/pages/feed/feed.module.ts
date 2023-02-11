import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeedRoutingModule } from './feed-routing.module';

import { MainModule } from './main/main.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FeedRoutingModule,
    MainModule
  ]
})
export class FeedModule { }
