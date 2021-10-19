import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MapOptions, Layer } from 'leaflet';
import { EventInterface } from 'src/app/shared/models/Event.interface';
import { MapCommunicationService } from 'src/app/shared/services/communication/map.communication.service';
import { ProgrammeService } from 'src/app/shared/services/data/programme/programme.service';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.page.html',
  styleUrls: ['./event-detail.page.scss'],
})
export class EventDetailPage implements OnInit {
  id: string;
  event: EventInterface;
  defaultHref = '/programme';

  options: MapOptions;
  markers: Layer[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private programmeService: ProgrammeService,
    private mapCommunication: MapCommunicationService,
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.id = this.activatedRoute.snapshot.params.id;
    this.programmeService.getEvent(this.id).subscribe(data => {
      this.event = data;

      if (this.event.position) {
        this.options = this.mapCommunication.getOptionsMap(
          this.event.position.lat,
          this.event.position.lng
        );
        this.markers = [
          this.mapCommunication.createMarker(
            this.event.position.lat,
            this.event.position.lng,
            `${this.event.title} - ${this.event.description}`,
            this.event.id)
        ]
      }
    });
  }

}
