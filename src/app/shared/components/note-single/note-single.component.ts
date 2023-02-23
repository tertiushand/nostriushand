import { Component, Input } from '@angular/core';

@Component({
  selector: 'nh-note-single',
  templateUrl: './note-single.component.html',
  styleUrls: ['./note-single.component.scss']
})
export class NoteSingleComponent {

  @Input() connectLine: boolean = false;

  getProfilePic(): URL {
    return new URL('https://i.imgur.com/a0TFmLV.jpeg');
  }

}
