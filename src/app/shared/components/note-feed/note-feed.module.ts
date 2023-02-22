import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoteFeedComponent } from './note-feed.component';
import { NoteSingleModule } from '../note-single/note-single.module';



@NgModule({
  declarations: [
    NoteFeedComponent
  ],
  imports: [
    CommonModule,
    NoteSingleModule
  ],
  exports: [
    NoteFeedComponent
  ]
})
export class NoteFeedModule { }
