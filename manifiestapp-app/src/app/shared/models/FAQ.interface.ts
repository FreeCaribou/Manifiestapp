export interface IFaq {
    title: string;
    id: string;
    field_paragraphs: {
        field_text: string;
        field_title: string;
    }[];
    field_teaser: string;
}