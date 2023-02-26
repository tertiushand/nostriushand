import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoteFeedComponent } from './note-feed.component';
import { NoteSingleModule } from '../note-single/note-single.module';
import { FeedBreakModule } from '../feed-break/feed-break.module';



@NgModule({
  declarations: [
    NoteFeedComponent
  ],
  imports: [
    CommonModule,
    NoteSingleModule,
    FeedBreakModule
  ],
  exports: [
    NoteFeedComponent
  ]
})
export class NoteFeedModule { }
