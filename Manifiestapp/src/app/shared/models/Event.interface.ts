import { EventDayEnum } from "./EventDay.enum";

export interface EventInterface {
  id?: string;
  title: string;
  description: string;
  imageSrc?: string;
  favorite?: boolean;
  day: EventDayEnum;
}