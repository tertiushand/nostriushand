import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoteSingleComponent } from './note-single.component';
import { NoteReactionModule } from '../note-reaction/note-reaction.module';
import { ProfilePicModule } from '../profile-pic/profile-pic.module';



@NgModule({
  declarations: [
    NoteSingleComponent
  ],
  imports: [
    CommonModule,
    NoteReactionModule,
    ProfilePicModule
  ],
  exports: [
    NoteSingleComponent
  ]
})
export class NoteSingleModule { }
