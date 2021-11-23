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

  title: RenderedInterface,
  tags?: number[],
  categories?: number[],
  content?: RenderedInterface,
  _embedded?: any,

  favorite?: boolean,

  // TODO in an object place ?
  position?: {
    lat: number,
    lng: number
  }
}