import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoteSingleComponent } from './note-single.component';
import { NoteReactionModule } from '../note-reaction/note-reaction.module';



@NgModule({
  declarations: [
    NoteSingleComponent
  ],
  imports: [
    CommonModule,
    NoteReactionModule
  ],
  exports: [
    NoteSingleComponent
  ]
})
export class NoteSingleModule { }
