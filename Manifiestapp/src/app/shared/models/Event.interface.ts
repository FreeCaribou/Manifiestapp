export interface RenderedInterface {
  rendered: string;
}

export interface WagtailApiReturn {
  items: WagtailApiEventItem[];
  meta: {
    total_count: number;
  }
}

export interface WagtailApiEventItemDaysList {
  day: string;
  dayDate?: Date;
  events: WagtailApiEventItem[];
}

export interface WagtailApiEventItem {
  id: number,
  api_event_dates: { day: string, start: string, end: string }[];
  api_location: { name: string, search_id: string };
  api_categories: {primary: string[], secondary: string[]},
  description: { type: string, value: string }[];
  title: string;
  favorite: boolean;
  inFavoriteConflict: boolean;
  image: { meta: { download_url: string } },
  thumbnail: {url: string, alt: string}
}

export interface DayListEventInterface {
  day: Date;
  events: EventInterface[];
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
        formatted: string;
      },
      "end-hour": {
        raw: string;
        formatted: string;
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
