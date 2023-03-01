import { Component, Input } from '@angular/core';
import { StorageHelperService } from '../../services/storage-helper.service';
import { NipNote, NipProfile } from '../../services/websocket/nostr.class';

@Component({
  selector: 'nh-note-single',
  templateUrl: './note-single.component.html',
  styleUrls: ['./note-single.component.scss']
})
export class NoteSingleComponent {

  @Input() connectLine?: boolean = false;
  @Input() note: NipNote = new NipNote({id: '404'});

  constructor(
    private storage: StorageHelperService
  ){}

  getProfilePic(): string {
    let profile = this.note.pubkey?this.getProfile(this.note.pubkey)?this.getProfile(this.note.pubkey):undefined:undefined;
    return profile && profile.picture?profile.picture:'https://i.imgur.com/a0TFmLV.jpeg';
  }

  getProfile(pubkey: string | undefined): NipProfile | undefined {
    return pubkey?this.storage.getProfiles()[pubkey]:undefined;
  }

  getName(): string | undefined {
    return this.getProfile(this.note.pubkey)?.name;
  }

  getPubkey(): string | undefined {
    return this.note.pubkey;
  }

  getContent(): string | undefined {
    return this.note.content;
  }

}
