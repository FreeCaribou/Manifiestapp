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
  category: {
    id: number,
    name: string,
  }

  locatie?: number[];
  localisation: {
    id: number,
    name: string,
  }

  day: {
    id: number,
    name: string,
  }

  image?: { url: string };

  _links?: { "wp:attachement": { href: string }[] };
  _embedded?: { "wp:term": any[], "wp:featuredmedia": any[] };
  // wp:term transform to more beautifull variable prop

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

  mainPictureUrl: string;

  // A kind of fake id from WordPress
  slug: string;

  favorite?: boolean;
  inFavoriteConflict?: boolean;



  description?: string;
  imageSrc?: string;
  tags?: number[];
  // probably delete one day
  position: { lat: number, lng: number };
}
