import { EventDayEnum } from "./EventDay.enum";

export interface RenderedInterface {
  rendered: string;
}

export interface EventInterface {
  id?: string;

  title?: RenderedInterface;
  headline?: string;
  // title?: string;

  content?: RenderedInterface;
  // content?: string;

  startDate?: Date;
  endDate?: Date;

  categories?: number[];

  locatie?: number[];

  image?: { url: string };

  _links?: { "wp:attachement": { href: string }[] };
  _embedded?: { "wp:term": any[] };
  // wp:term transform to more beautifull variable prop
  categoriesTerm?: any[];
  dayTerm?: any;
  locationTerm?: any;

  // TODO ask for english name
  "toolset-meta"?: {
    "info-evenement": {
      afbeelding: {
        raw: string;
      },
      "facebook-pagina": {
        raw: string;
      },
      "start-hour": {
        raw: string;
      },
      "end-hour": {
        raw: string;
      }
    }
  };

  // A kind of fake id from WordPress
  slug: string;

  favorite?: boolean;



  description?: string;
  imageSrc?: string;
  day?: EventDayEnum;
  tags?: number[];
  // probably delete one day
  position: { lat: number, lng: number };
}
