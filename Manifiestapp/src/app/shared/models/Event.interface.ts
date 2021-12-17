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

  description?: string;
  imageSrc?: string;
  day?: EventDayEnum;
  tags?: number[];
  _embedded?: any;
  start_date?: string;
  end_date?: string;

  favorite?: boolean;

  // probably delete one day
  position: { lat: number, lng: number };
}
