import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoteThreadComponent } from './note-thread.component';



@NgModule({
  declarations: [
    NoteThreadComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    NoteThreadComponent
  ]
})
export class NoteThreadModule { }
