import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { MainSeparatorModule } from 'src/app/shared/layouts/main-separator/main-separator.module';
import { TopicHeadModule } from 'src/app/shared/components/topic-head/topic-head.module';



@NgModule({
  declarations: [
    MainComponent
  ],
  imports: [
    CommonModule,
    MainSeparatorModule,
    TopicHeadModule
  ]
})
export class MainModule { }
