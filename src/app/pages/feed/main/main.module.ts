import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { MainSeparatorModule } from 'src/app/shared/layouts/main-separator/main-separator.module';



@NgModule({
  declarations: [
    MainComponent
  ],
  imports: [
    CommonModule,
    MainSeparatorModule
  ]
})
export class MainModule { }
