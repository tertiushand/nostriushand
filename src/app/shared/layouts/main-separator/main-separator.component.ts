import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnDestroy } from '@angular/core';
import { ObserveVisibilityDirective } from '../../directives/observe-visibility.directive';

@Component({
  selector: 'nh-main-separator',
  templateUrl: './main-separator.component.html',
  styleUrls: ['./main-separator.component.scss'],
  providers: [ ObserveVisibilityDirective]
})
export class MainSeparatorComponent implements OnDestroy {

  ngOnDestroy(): void {
    this._document.removeEventListener('scroll', this.onContentScrolled);
  }

  private currentPosition: number = 0;
  private topIsVisible: boolean = false;
  private bottomIsVisible: boolean = false;

  constructor(
    @Inject(DOCUMENT) private _document: Document
  ) {
    this._document.addEventListener('scroll', this.onContentScrolled);
  }

  bottomVisible() {
    console.log('bottom is visible');
    this.bottomIsVisible = true;
  }

  topVisible() {
    console.log('top is visible');
    this.topIsVisible = true;
  }

  onContentScrolled = (e: any) => {
    let scroll = window.pageYOffset;
    if (scroll > this.currentPosition) {
      //if scrolling down
      this.topIsVisible = false;
    } else {
      //if scrolling up
      this.bottomIsVisible = false;
    }
    this.currentPosition = scroll;
  }
}
