import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidenavComponent } from './sidenav.component';
import { ButtonLargeModule } from '../button-large/button-large.module';



@NgModule({
  declarations: [
    SidenavComponent
  ],
  imports: [
    CommonModule,
    ButtonLargeModule
  ],
  exports: [
    SidenavComponent
  ]
})
export class SidenavModule { }
