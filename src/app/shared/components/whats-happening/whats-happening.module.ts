import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WhatsHappeningComponent } from './whats-happening.component';
import { LightFadeContainerModule  } from '../light-fade-container/light-fade-container.module'


@NgModule({
  declarations: [
    WhatsHappeningComponent
  ],
  imports: [
    CommonModule,
    LightFadeContainerModule
  ],
  exports: [
    WhatsHappeningComponent
  ]
})
export class WhatsHappeningModule { }
