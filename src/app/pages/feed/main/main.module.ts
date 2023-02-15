import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { MainSeparatorModule } from 'src/app/shared/layouts/main-separator/main-separator.module';
import { TopicHeadModule } from 'src/app/shared/components/topic-head/topic-head.module';
import { SearchBarModule } from 'src/app/shared/components/search-bar/search-bar.module';
import { WhatsHappeningModule } from 'src/app/shared/components/whats-happening/whats-happening.module';
import { WhoToFollowModule } from 'src/app/shared/components/who-to-follow/who-to-follow.module';
import { FooterLinksModule } from 'src/app/shared/components/footer-links/footer-links.module';



@NgModule({
  declarations: [
    MainComponent
  ],
  imports: [
    CommonModule,
    MainSeparatorModule,
    TopicHeadModule,
    SearchBarModule,
    WhatsHappeningModule,
    WhoToFollowModule,
    FooterLinksModule
  ]
})
export class MainModule { }
