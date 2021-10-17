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
          'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
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
      marker(
        [51.22427, 2.89793],
        {
          icon: icon({
            iconSize: [25, 41],
            iconUrl: 'leaflet/marker-icon.png',
          })
        }
      ).bindPopup('<p id="link" data-id="test">Entrance</p>').on('popupopen', () => {
        this.doc.querySelector('#link')
          .addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            console.log('on popup click id', id)
          });
      })
    ]
  }

}