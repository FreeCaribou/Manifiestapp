import { EventDayEnum } from "./EventDay.enum";

export interface RenderedInterface {
  rendered: string;
}

export interface EventInterface {
  id?: string;
  // title: string;
  description?: string;
  imageSrc?: string;
  day: EventDayEnum;
  title: string,
  tags?: number[],
  categories?: number[],
  content?: string,
  _embedded?: any,

  // TODO rework more precise
  image?: { url: string };

  start_date?: string;
  end_date?: string;

  favorite?: boolean,

  // TODO in an object place ?
  position?: {
    lat: number,
    lng: number
  }
}

export interface EventArrayInterface {
  events: EventInterface[];
}