import { Component, OnInit } from '@angular/core';

import { RelayService } from '../../shared/services/websocket/relay.service';

@Component({
  selector: 'app-test-page',
  templateUrl: './test-page.component.html',
  styleUrls: ['./test-page.component.scss']
})
export class TestPageComponent implements OnInit {

  constructor(
    private relays: RelayService
  ){}

  ngOnInit(): void {
    this.relays.initiateCommonRelays();

    this.relays.initializedRelays['wss://nostr-pub.wellorder.net'].listen().subscribe(response => {
      console.log(response);
    });    
  }

  makeCall() {
    this.relays.initializedRelays['wss://nostr-pub.wellorder.net'].sendMessage({
      requestId: 'adhoc',
      authors: ["e998cd0639d0167fb71d3fcc1c140dc6241f372884d5fd300bbec95e206163b5"],
      kinds: [1]
    });
  }

  closeRelay1() {
    this.relays.initializedRelays['wss://nostr-pub.wellorder.net'].closeRequest('adhoc');
  }

}
