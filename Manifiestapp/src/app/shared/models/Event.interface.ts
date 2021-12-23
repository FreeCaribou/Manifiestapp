import { EventDayEnum } from "./EventDay.enum";

export interface RenderedInterface {
  rendered: string;
}

export interface EventInterface {
  id?: string;

  title?: RenderedInterface;
  // title?: string;

  content?: RenderedInterface;
  // content?: string;

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
  start_date?: string;
  end_date?: string;
  // probably delete one day
  position: { lat: number, lng: number };
}
