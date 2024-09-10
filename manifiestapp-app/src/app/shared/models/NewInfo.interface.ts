import { RenderedInterface } from "./Event.interface";

export interface NewInfoInterface {
  id?: string;

  title?: RenderedInterface;
  headline?: string;
  // title?: string;

  content?: RenderedInterface;
  // content?: string;
  allText: string;

  excerpt?: RenderedInterface;
  shortText: string;

  _embedded?: { "wp:term": any[], "wp:featuredmedia": any[] };
  // wp:term transform to more beautifull variable prop

  mainPictureUrl: string;

  // A kind of fake id from WordPress
  slug: string;

  sticky: boolean;
}
