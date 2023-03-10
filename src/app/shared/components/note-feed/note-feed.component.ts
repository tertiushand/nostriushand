import { Component } from '@angular/core';
import { StorageHelperService } from '../../services/storage-helper.service';
import { SystemEvent, SystemProfile } from '../../services/system.class';

@Component({
  selector: 'nh-note-feed',
  templateUrl: './note-feed.component.html',
  styleUrls: ['./note-feed.component.scss']
})
export class NoteFeedComponent {

  constructor(
    private storage: StorageHelperService
  ){
    this.storage.addToProfiles(new SystemProfile({
      name: '402guy',
      nostrId: '402',
      picture: 'https://i.imgur.com/OceR8kw.png'
    }));
  }

  testNote: SystemEvent[] = [
    new SystemEvent({
      profileId: '402',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Risus at ultrices mi tempus imperdiet nulla malesuada.'
    }),
    new SystemEvent({
      profileId: '403',
      content: 'Feugiat vivamus at augue eget arcu dictum. Adipiscing at in tellus integer feugiat scelerisque varius morbi enim.'
    }),
    new SystemEvent({
      profileId: '404',
      content: 'Elit eget gravida cum sociis natoque penatibus et magnis dis. Sit amet consectetur adipiscing elit pellentesque. Leo urna molestie at elementum eu facilisis sed odio. Mauris vitae ultricies leo integer. Dictum at tempor commodo ullamcorper.'
    }),
  ]
}
