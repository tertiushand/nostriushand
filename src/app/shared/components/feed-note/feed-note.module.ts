import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeedNoteComponent } from './feed-note.component';



@NgModule({
  declarations: [
    FeedNoteComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    FeedNoteComponent
  ]
})
export class FeedNoteModule { }
