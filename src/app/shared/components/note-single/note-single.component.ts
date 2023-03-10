import { Component, Input } from '@angular/core';
import { StorageHelperService } from '../../services/storage-helper.service';
import { SystemEvent, SystemProfile } from '../../services/system.class';

@Component({
  selector: 'nh-note-single',
  templateUrl: './note-single.component.html',
  styleUrls: ['./note-single.component.scss']
})
export class NoteSingleComponent {

  @Input() connectLine?: boolean = false;
  @Input() event: SystemEvent = new SystemEvent({id: '404'});

  constructor(
    private storage: StorageHelperService
  ){}

  getProfilePic(): string {
    let profile = this.event.profileId?this.getProfile(this.event.profileId)?this.getProfile(this.event.profileId):undefined:undefined;
    return profile && profile.picture?profile.picture:'https://i.imgur.com/a0TFmLV.jpeg';
  }

  getProfile(pubkey: string | undefined): SystemProfile | undefined {
    return pubkey?this.storage.getProfiles()[pubkey]:undefined;
  }

  getName(): string | undefined {
    return this.getProfile(this.event.profileId)?.name;
  }

  getPubkey(): string | undefined {
    return this.event.profileId;
  }

  getContent(): string | undefined {
    return this.event.content;
  }

}
