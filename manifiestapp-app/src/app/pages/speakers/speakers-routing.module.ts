import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SpeakerListPage } from './speakers-list.page';
import { SpeakerDetailPage } from './speaker-detail.page';

const routes: Routes = [
  {
    path: '',
    component: SpeakerListPage
  },
  {
    path: 'speaker-detail/:id',
    component: SpeakerDetailPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SpeakersRoutingModule {}
