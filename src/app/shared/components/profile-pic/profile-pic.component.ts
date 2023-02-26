import { Component, Input } from '@angular/core';

@Component({
  selector: 'nh-profile-pic',
  templateUrl: './profile-pic.component.html',
  styleUrls: ['./profile-pic.component.scss']
})
export class ProfilePicComponent {

  @Input() size?: number = 48;
  @Input() border?: boolean = true;
  @Input() image: string = 'http://bob.com';

}
