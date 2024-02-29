import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { icon, latLng, Layer, marker, tileLayer, MapOptions } from 'leaflet';
import { Router } from '@angular/router';
import { ProgrammeService } from '../data/programme/programme.service';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapCommunicationService {

  constructor(
    @Inject(DOCUMENT) private doc,
    public router: Router,
    private programmeService: ProgrammeService,
  ) { }

  getOptionsMap(lat: number = 51.22353, lng: number = 2.90210, zoom: number = 18, minZoom: number = 17): MapOptions {
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

  getMainMapMarker(): Observable<Layer[]> {
    return this.programmeService.getEventLocalisationsDetail().pipe(
      map(data => {
        console.log('data of the localisation', data)
        // TODO make a map(lol)ping with the localisation provide by the website
        const baseMarkers = [
          this.createMarker(51.22427, 2.89793, 'entrance', 'entrance'),
        ];
        // TODO play with ID of localisation to retrieve the good thing later for the linking to the good route
        data.forEach(d => {
          if (d.field_geolocation) {
            baseMarkers.push(
              this.createMarker(
                d.field_geolocation.lat, d.field_geolocation.lon, d.title, d.id, true
              )
            );
          }
        });
        return baseMarkers;
      })
    )
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
    ).bindPopup(
      `<p id="link-${id}" data-id="${id}" data-haveLink="${haveLink}" ${haveLink ? 'class="fake-mouse-select tertiary-color"' : ''}>${label}</p>`
    ).on('popupopen', () => {
      this.doc.querySelector('#link-' + id)
        .addEventListener('click', (e) => {
          try {
            const id = e.target.getAttribute('data-id').toString().replaceAll('_', ' ').trim();
            const haveLink = e.target.getAttribute('data-haveLink');
            console.log('hello id', id, haveLink)
            if (haveLink == 'true') {
              this.programmeService.getEventLocalisationsDetail().subscribe(localisations => {
                const localisation = localisations.find(x => x.id === id);
                if (localisation) {
                  this.router.navigate(['programme', 'subprogramme', 'localisation', localisation.title]);
                }
              })
            }
          } catch (e) { }
        });
    })
  }

}