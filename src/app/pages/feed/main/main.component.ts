import { Component } from '@angular/core';
import { TopicHead } from 'src/app/shared/components/topic-head/topic-head.interface';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {

  public topics: TopicHead[] = [
    { name: 'Feed', route: ['feed']},
    { name: 'Notes', route: ['feed', 'notes']},
    { name: 'Replies', route: ['feed', 'replies']}
  ]

}
