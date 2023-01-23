import { Component, OnInit } from '@angular/core';
import { StorageHelperService } from 'src/app/shared/services/storage-helper.service';
import { NostrMsgHelperService } from 'src/app/shared/services/websocket/nostr-msg-helper.service';
import { iNipEvent, Nos2x } from 'src/app/shared/services/websocket/nostr.interface';

import { RelayService } from '../../shared/services/websocket/relay.service';

@Component({
  selector: 'app-test-page',
  templateUrl: './test-page.component.html',
  styleUrls: ['./test-page.component.scss']
})
export class TestPageComponent implements OnInit {

  constructor(
    private relays: RelayService,
    private nostrMsg: NostrMsgHelperService,
    private storage: StorageHelperService
  ){}

  private relayUrl: string = 'wss://nostr.onsats.org';
  private userPubkey: string = 'e998cd0639d0167fb71d3fcc1c140dc6241f372884d5fd300bbec95e206163b5'

  ngOnInit(): void {
    //this.nostrMsg.initiateCommonRelays();
  }

  listenToRelay() {
    this.relays.initializedRelays[this.relayUrl].listen().subscribe(profile => {
      if (profile[2])
        this.nostrMsg.scrutinizeResponse(profile[2] as iNipEvent, profile[1] as string, this.relayUrl)
    });
    console.log('listening to '+this.relayUrl)
  }

  closeRelay1() {
    this.relays.initializedRelays[this.relayUrl].closeRequest('adhoc');
  }

  getProfile() {
    this.nostrMsg.getUserProfile(this.userPubkey,this.relayUrl);
  }

  getPosts() {
    this.nostrMsg.getUserEvents(this.userPubkey,this.relayUrl);
  }

  getRelays() {
    this.nostrMsg.getUserRelay(this.userPubkey,this.relayUrl);
  }

  getEvent() {
    this.nostrMsg.getEvent('c52e8a34e44e103b110d0961a11fdf7ca9adc89382fd02917f4d7ef5ec6edd0f',this.relayUrl);
  }

  getContacts() {
    this.nostrMsg.getUserContacts(this.userPubkey,this.relayUrl);
  }

  showNotes() {
    console.log(this.storage.getNotes());
  }

  showProfiles() {
    console.log(this.storage.getProfiles());
  }

  getNos2xPubKey() {
    let nos2x = window as Window as Nos2x;
    return nos2x.nostr.getPublicKey() as Window;
  }

}
