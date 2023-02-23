import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainSeparatorComponent } from './main-separator.component';
import { ObserveVisibilityDirective } from '../../directives/observe-visibility.directive';



@NgModule({
  providers: [
    
  ],
  declarations: [
    MainSeparatorComponent,
    ObserveVisibilityDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    MainSeparatorComponent
  ]
})
export class MainSeparatorModule { }
