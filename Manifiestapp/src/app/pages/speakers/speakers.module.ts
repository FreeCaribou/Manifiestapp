import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/shared/shared.module';
import { SpeakersRoutingModule } from './speakers-routing.module';
import { SpeakerDetailPage } from './speaker-detail.page';
import { SpeakerListPage } from './speakers-list.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        SpeakersRoutingModule,
        SharedModule,
    ],
    declarations: [SpeakerDetailPage, SpeakerListPage]
})
export class SpeakersPageModule { }
