import { Component, Input } from '@angular/core';

@Component({
  selector: 'nh-feed-break',
  templateUrl: './feed-break.component.html',
  styleUrls: ['./feed-break.component.scss']
})
export class FeedBreakComponent {
  @Input() isReply?: boolean = false;
}
