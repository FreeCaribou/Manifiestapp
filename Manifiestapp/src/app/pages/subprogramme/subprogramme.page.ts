import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventInterface } from 'src/app/shared/models/Event.interface';

@Component({
  selector: 'app-subprogramme',
  templateUrl: './subprogramme.page.html',
  styleUrls: ['./subprogramme.page.scss'],
})
export class SubprogrammePage implements OnInit {
  day: string;
  list: EventInterface[];

  constructor(
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.day = this.activatedRoute.snapshot.data.day;

    if (this.day === 'saturday') {
      this.list = [
        {
          title: 'Main stage',
          favorite: true,
          description: 'Le show principal avec les discours',
          imageSrc: 'https://www.manifiesta.be/sites/default/files/styles/node_full_view/public/programma/image%20%2830%29_1.png?itok=gRkUWXTg'
        },
        {
          title: 'Musique',
          favorite: false,
          description: 'On chante et on danse',
          imageSrc: 'https://www.manifiesta.be/sites/default/files/styles/node_full_view/public/programma/BRLRS%20in%20leffinge.jpg?itok=QAlQZKeS'
        },
        {
          title: 'Vive la commune',
          description: 'Expo et débat sur la commune',
          imageSrc: 'https://www.manifiesta.be/sites/default/files/styles/node_full_view/public/programma/Banniere_Manifiesta2021.jpg?itok=IagHg-k-'
        },
        {
          title: 'Syndicat',
          description: '',
          favorite: true,
          imageSrc: 'https://www.manifiesta.be/sites/default/files/styles/node_full_view/public/programma/Organizing%20%3A%20toekomst%20van%20de%20vakbond%3F.png?itok=MpYXYJKq'
        },
        {
          title: 'We are one',
          description: 'Manifeste pour l\'unité de la Belgique',
          imageSrc: 'https://www.manifiesta.be/sites/default/files/styles/node_full_view/public/programma/We%20are%20one.%20Manifest%20voor%20de%20eenheid%20van%20Belgie.JPG?itok=Jxi8njWk'
        },
        {
          title: 'Pension',
          description: '67 ans ?',
          imageSrc: 'https://www.manifiesta.be/sites/default/files/styles/node_full_view/public/programma/pensioenverzet.jpg?itok=Ye5l4NXY'
        },
        {
          title: '',
          description: 'On lève le verre à 50 ans de Médecine pour le Peuple ',
          imageSrc: 'https://www.manifiesta.be/sites/default/files/styles/node_full_view/public/programma/Receptie%2050%20jaar%20ZATERDAG_1.jpg?itok=hafpzBjR'
        },
        {
          title: 'Inondation',
          description: '',
          imageSrc: 'https://www.manifiesta.be/sites/default/files/styles/node_full_view/public/programma/Overstromingen%2C%20oorzaken%20en%20politieke%20verantwoordelijkheden.png?itok=DCYzkmMd'
        },
      ]
    } else if (this.day === 'sunday') {
      this.list = [
        {
          title: 'Cuba',
          description: 'Stop au blocage',
          imageSrc: 'https://www.manifiesta.be/sites/default/files/styles/node_full_view/public/programma/conferentieBLOKKADE.jpg?itok=zPmGwKxP'
        },
        {
          title: 'Palestine',
          description: 'Youth For Palestine',
          imageSrc: 'https://www.manifiesta.be/sites/default/files/styles/node_full_view/public/programma/Youth%20For%20Palestine.jpg?itok=t1ew6nWG'
        },
      ]
    }
  }

}
