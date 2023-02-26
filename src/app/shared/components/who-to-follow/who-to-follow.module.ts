import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WhoToFollowComponent } from './who-to-follow.component';
import { LightFadeContainerModule } from '../light-fade-container/light-fade-container.module';
import { ProfilePicModule } from '../profile-pic/profile-pic.module';



@NgModule({
  declarations: [
    WhoToFollowComponent
  ],
  imports: [
    CommonModule,
    LightFadeContainerModule,
    ProfilePicModule
  ],
  exports: [
    WhoToFollowComponent
  ]
})
export class WhoToFollowModule { }
