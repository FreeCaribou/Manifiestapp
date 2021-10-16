import { EventInterface } from "src/app/shared/models/Event.interface";
import { EventDayEnum } from "src/app/shared/models/EventDay.enum";

export const MOCK_GET_ALL_PROGRAMME: EventInterface[] = [
  {
    title: 'Main stage',
    description: 'Le show principal avec les discours',
    imageSrc: 'https://www.manifiesta.be/sites/default/files/styles/node_full_view/public/programma/image%20%2830%29_1.png?itok=gRkUWXTg',
    day: EventDayEnum.SATURDAY,
    id: '1'
  },
  {
    title: 'Musique',
    description: 'On chante et on danse',
    imageSrc: 'https://www.manifiesta.be/sites/default/files/styles/node_full_view/public/programma/BRLRS%20in%20leffinge.jpg?itok=QAlQZKeS',
    day: EventDayEnum.SATURDAY,
    id: '2'
  },
  {
    title: 'Vive la commune',
    description: 'Expo et débat sur la commune',
    imageSrc: 'https://www.manifiesta.be/sites/default/files/styles/node_full_view/public/programma/Banniere_Manifiesta2021.jpg?itok=IagHg-k-',
    day: EventDayEnum.SATURDAY,
    id: '3'
  },
  {
    title: 'Syndicat',
    description: '',
    imageSrc: 'https://www.manifiesta.be/sites/default/files/styles/node_full_view/public/programma/Organizing%20%3A%20toekomst%20van%20de%20vakbond%3F.png?itok=MpYXYJKq',
    day: EventDayEnum.SATURDAY,
    id: '4'
  },
  {
    title: 'We are one',
    description: 'Manifeste pour l\'unité de la Belgique',
    imageSrc: 'https://www.manifiesta.be/sites/default/files/styles/node_full_view/public/programma/We%20are%20one.%20Manifest%20voor%20de%20eenheid%20van%20Belgie.JPG?itok=Jxi8njWk',
    day: EventDayEnum.SATURDAY,
    id: '5'
  },
  {
    title: 'Pension',
    description: '67 ans ?',
    imageSrc: 'https://www.manifiesta.be/sites/default/files/styles/node_full_view/public/programma/pensioenverzet.jpg?itok=Ye5l4NXY',
    day: EventDayEnum.SATURDAY,
    id: '6'
  },
  {
    title: '',
    description: 'On lève le verre à 50 ans de Médecine pour le Peuple ',
    imageSrc: 'https://www.manifiesta.be/sites/default/files/styles/node_full_view/public/programma/Receptie%2050%20jaar%20ZATERDAG_1.jpg?itok=hafpzBjR',
    day: EventDayEnum.SATURDAY,
    id: '7'
  },
  {
    title: 'Inondation',
    description: '',
    imageSrc: 'https://www.manifiesta.be/sites/default/files/styles/node_full_view/public/programma/Overstromingen%2C%20oorzaken%20en%20politieke%20verantwoordelijkheden.png?itok=DCYzkmMd',
    day: EventDayEnum.SATURDAY,
    id: '8'
  },
  {
    title: 'Cuba',
    description: 'Stop au blocage',
    imageSrc: 'https://www.manifiesta.be/sites/default/files/styles/node_full_view/public/programma/conferentieBLOKKADE.jpg?itok=zPmGwKxP',
    day: EventDayEnum.SUNDAY,
    id: '9'
  },
  {
    title: 'Palestine',
    description: 'Youth For Palestine',
    imageSrc: 'https://www.manifiesta.be/sites/default/files/styles/node_full_view/public/programma/Youth%20For%20Palestine.jpg?itok=t1ew6nWG',
    day: EventDayEnum.SUNDAY,
    id: '10'
  },
]