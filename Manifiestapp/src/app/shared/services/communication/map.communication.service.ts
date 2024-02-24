import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { icon, latLng, Layer, marker, tileLayer, MapOptions } from 'leaflet';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class MapCommunicationService {

  constructor(
    @Inject(DOCUMENT) private doc,
    public router: Router,
  ) { }

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
      this.createMarker(51.22353, 2.90210, 'Main Stage !', 'Main_Stage', true),
    ]
  }

  createMarker(lat: number, lng: number, label: string, id: string, haveLink = false): Layer {
    return marker(
      [lat, lng],
      {
        icon: icon({
          iconSize: [25, 41],
          iconUrl: 'leaflet/marker-icon.png',
        })
      }
    ).bindPopup('<p id="link-' + id + '" data-id=" ' + id + '" data-haveLink="' + haveLink + '">' + label + '</p>').on('popupopen', () => {
      this.doc.querySelector('#link-' + id)
        .addEventListener('click', (e) => {
          try {
            const id = e.target.getAttribute('data-id').toString().replaceAll('_', ' ').trim();
            const haveLink = e.target.getAttribute('data-haveLink');
            console.log('hello id', id, haveLink)
            if (haveLink == 'true') {
              this.router.navigate(['programme', 'subprogramme', 'localisation', id]);
            }
          } catch (e) { }
        });
    })
  }

}