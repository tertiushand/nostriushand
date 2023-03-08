import { Component, OnInit } from '@angular/core';
import { TopicHead } from 'src/app/shared/components/topic-head/topic-head.interface';
import { StorageHelperService } from 'src/app/shared/services/storage-helper.service';
import { EventIds, NostrMsgHelperService } from 'src/app/shared/services/websocket/nostr-msg-helper.service';
import { iNipEvent } from 'src/app/shared/services/websocket/nostr.interface';
import { RelayService } from 'src/app/shared/services/websocket/relay.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  constructor(
    private nostrMsg: NostrMsgHelperService,
    private relays: RelayService,
    private storage: StorageHelperService
  ){}

  ngOnInit(): void {
    this.populateFeedNotes();
  }

  private relayUrl: string = this.relays.relays[0];

  populateFeedNotes() {

    this.nostrMsg.initiateNewRelay(this.relayUrl);
    console.log('listening to '+this.relayUrl);

    if (this.storage.getUserInfo().pubkey) {
      this.relays.initializedRelays[this.relayUrl].sendMessage({
        requestId: 'INITIAL_USER_COLLECT',
        authors: [this.storage.getUserInfo().pubkey as string],
        kinds: [0,1,2,3]
      });
    }
  }

  public topics: TopicHead[] = [
    { name: 'Following', route: ['feed'] },
    { name: 'Notes', route: ['feed', 'notes'] },
    { name: 'Replies', route: ['feed', 'replies'] },
    { name: 'Media', route: ['feed', 'replies'] }
  ]

}
