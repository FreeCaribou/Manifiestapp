export const departments = [
  { label: 'Province Section', labelFr: 'PTB', labelNl: 'PVDA', code: 'BASE', id: 1},
  { label: 'GVHV', labelFr: 'MPLP', labelNl: 'GVHV', code: 'GVHV', id: 2},
  { label: 'Comac', labelFr: 'Comac', labelNl: 'Comac', code: 'Comac', id: 3 },
  { label: 'Redfox', labelFr: 'Redfox', labelNl: 'Redfox', code: 'Redfox', id: 6 },
  { label: 'Intal', labelFr: 'Intal', labelNl: 'Intal', code: 'Intal', id: 7 },
  { label: 'Cubanismo', labelFr: 'Cubanismo', labelNl: 'Cubanismo', code: 'Cubanismo', id: 8 },
  { label: 'Zelle', labelFr: 'Zelle', labelNl: 'Zelle',  code: 'Zelle', id: 9 },
];

export const provinces: { label: string, code: string, ranges: { start:number, end:number}[]}[] = [
  {
    label: 'Brussels-Bruxelles-Brabant Wallon',
    code: 'BBW',
    ranges: [{start: 1000, end: 1299}, {start:1300, end: 1499}]
  },
  {
    label: 'Namur',
    code: 'NLU',
    ranges: [{start: 5000, end: 5599},{start:5700, end:5999}]
  },
  {
    label: 'Hainaut',
    code: 'HAI',
    ranges: [{start: 6000, end: 6599},{start:7000, end:7999},{start:5600, end:5699}]
  },
  {
    label: 'Vlaams Brabant',
    code: 'VLB',
    ranges: [{start: 1500, end: 1999},{start:3000, end:3499}]
  },
  {
    label: 'Antwerpen',
    code: 'ANT',
    ranges: [{start: 2000, end: 2999}]
  },
  {
    label: 'Limburg',
    code: 'LIM',
    ranges: [{start: 3500, end: 3999}]
  },
  {
    label: 'Liège-Luxembourg',
    code: 'LIE',
    ranges: [{start: 4000, end: 4999},{start:6600, end:6999}]
  },
  {
    label: 'West Vlaanderen',
    code: 'WEV',
    ranges: [{start: 8000, end: 8999}]
  },
  {
    label: 'Oost Vlaanderen',
    code: 'OOV',
    ranges: [{start: 9000, end: 9999}]
  },
]
