import { Component, ElementRef } from '@angular/core';
import { icon, latLng, Layer, marker, tileLayer } from 'leaflet';
import * as L from 'leaflet';
import { MarkerPopupComponent } from 'src/app/shared/components/marker-popup/marker-popup.component';
import { NgElement, WithProperties } from '@angular/elements';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage {

  options;
  markers: Layer[] = [];

  constructor(private element: ElementRef) { }

  ionViewDidEnter() {
    this.options = {
      layers: [
        tileLayer(
          'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          {
            maxZoom: 18,
            attribution: `Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> 
            contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>`
          })
      ],
      zoom: 17,
      center: latLng(51.22467, 2.90048)
    };

    let p = L.popup().setContent('<p id="link" data-id="test">Entrance</p>');

    this.markers.push(
      marker(
        [51.22467, 2.90048],
        {
          title: 'test',
          icon: icon({
            iconSize: [25, 41],
            iconAnchor: [13, 41],
            iconUrl: 'leaflet/marker-icon.png',
            shadowUrl: 'leaflet/marker-shadow.png'
          })
        }
      ).bindPopup(p).on('popupopen', () => {
        this.element.nativeElement.querySelector('#link')
          .addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            console.log('on popup click id', id)
          });
      })
    );
  }
}
