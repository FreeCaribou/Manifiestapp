import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { icon, latLng, Layer, marker, tileLayer, MapOptions } from 'leaflet';

@Injectable({
  providedIn: 'root'
})
export class MapCommunicationService {

  constructor(@Inject(DOCUMENT) private doc) { }

  getOptionsMap(lat: number = 51.22375, lng: number = 2.90052, zoom: number = 17, minZoom: number = 16): MapOptions {
    return {
      layers: [
        tileLayer(
          'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          {
            minZoom: minZoom,
            attribution: `Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> 
            contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>`
          })
      ],
      zoom: zoom,
      center: latLng(lat, lng)
    };
  }

  getMainMapMarker(): Layer[] {
    return [
      this.createMarker(51.22427, 2.89793, 'entrance', 'entrance'),
      this.createMarker(51.22353, 2.90210, 'main-stage', 'main-stage'),
    ]
  }

  createMarker(lat: number, lng: number, label: string, id: string): Layer {
    return marker(
      [lat, lng],
      {
        icon: icon({
          iconSize: [25, 41],
          iconUrl: 'leaflet/marker-icon.png',
        })
      }
    ).bindPopup('<p id="link-' + id + '" data-id=" ' + id + '">' + label + '</p>').on('popupopen', () => {
      this.doc.querySelector('#link-' + id)
        .addEventListener('click', (e) => {
          const id = e.target.getAttribute('data-id');
          console.log('on popup click id', id)
        });
    })
  }

}