import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { icon, latLng, Layer, marker, tileLayer, MapOptions } from 'leaflet';
import { Router } from '@angular/router';
import { ProgrammeService } from '../data/programme/programme.service';
import { Observable, forkJoin, map, mergeMap, of } from 'rxjs';
import { ILocalisation } from '../../models/Event.interface';

@Injectable({
  providedIn: 'root'
})
export class MapCommunicationService {

  constructor(
    @Inject(DOCUMENT) private doc,
    public router: Router,
    private programmeService: ProgrammeService,
  ) { }

  getOptionsMap(lat: number = 51.223546536033716, lng: number = 2.8998166168913353, zoom: number = 17, minZoom: number = 17): MapOptions {
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
    // TODO check the data from aaaaaall the localisation (need change in service too so)
    // TODO and check for each if there are event or not (if there are event, make the link, if not, dont)
    return this.programmeService.getEventLocalisationsDetail().pipe(
      mergeMap(data => {
        return forkJoin([of(data), this.programmeService.getLocalisations()])
      }),
      map((data) => {
        const baseMarkers = [
          this.createMarker(51.22366886322361, 2.8979757651092526, 'Entrance', 'Entrance', false, './assets/pictures/avatar_color.jpg'),
        ];
        // To have localisation that have event and geo point there
        const localisationsPresentDetail: ILocalisation[] = data[1]
        .filter(x => data[0].find(y => y.uuid === x.id))
        .filter(x => x.field_geolocation);
        localisationsPresentDetail.forEach(d => {
          let logoColor = 'red';
          if (d.title === 'Main Stage') {
            logoColor = 'color';
          } else if (d.hasFoodOrDrink) {
            logoColor = 'green';
          }
          baseMarkers.push(
            this.createMarker(
              d.field_geolocation.lat, d.field_geolocation.lon, d.title, d.id, true, `./assets/pictures/avatar_${logoColor}.jpg`
            )
          );
        });

        // Add WC and other
        baseMarkers.push(this.createMarker(51.22307, 2.89834, 'WC', 'WC'));
        baseMarkers.push(this.createMarker(51.22451, 2.90185, 'WC', 'WC'));
        baseMarkers.push(this.createMarker(51.22344949880343, 2.9008206611179572, 'WC', 'WC'));
        return baseMarkers;
      })
    )
  }

  createMarker(lat: number, lng: number, label: string, id: string, haveLink = false, picture = './assets/pictures/avatar_yellow.jpg'): Layer {
    return marker(
      [lat, lng],
      {
        icon: icon({
          iconSize: [24, 24],
          iconUrl: picture,
        })
      }
    ).bindPopup(
      `<p id="link-${id}" data-id="${id}" data-haveLink="${haveLink}" ${haveLink ? 'class="fake-mouse-select heart-color"' : ''}>${label}</p>`
    ).on('popupopen', () => {
      this.doc.querySelector('#link-' + id)
        .addEventListener('click', (e) => {
          try {
            const id = e.target.getAttribute('data-id').toString().replaceAll('_', ' ').trim();
            const haveLink = e.target.getAttribute('data-haveLink');
            console.log('hello id of the place', id, haveLink)
            if (haveLink == 'true') {
              this.programmeService.getEventLocalisationsDetail().subscribe(localisations => {
                const localisation = localisations.find(x => x.uuid === id);
                if (localisation) {
                  this.router.navigate(['programme', 'subprogramme', 'localisation'], { queryParams: { place: localisation.title } });
                }
              })
            }
          } catch (e) { }
        });
    })
  }

}