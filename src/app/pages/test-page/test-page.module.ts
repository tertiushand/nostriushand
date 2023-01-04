import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestPageComponent } from './test-page.component';
import { TestPageRoutingModule } from './test-page-routing.module';



@NgModule({
  declarations: [
    TestPageComponent
  ],
  imports: [
    CommonModule,
    TestPageRoutingModule
  ]
})
export class TestPageModule { }
