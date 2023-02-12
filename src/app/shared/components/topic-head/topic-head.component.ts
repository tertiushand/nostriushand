import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { TopicHead } from './topic-head.interface';

@Component({
  selector: 'nh-topic-head',
  templateUrl: './topic-head.component.html',
  styleUrls: ['./topic-head.component.scss']
})
export class TopicHeadComponent {

  constructor(
    public router: Router
  ){}

  @Input() topics: TopicHead[] = [];

}
