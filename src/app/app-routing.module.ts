import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'test',
    loadChildren: () => import('./pages/test-page/test-page.module').then(m => m.TestPageModule)
  },{
    path: 'feed',
    loadChildren: () => import('./pages/feed/feed.module').then(m => m.FeedModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
