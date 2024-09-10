import { Sort } from "@angular/material/sort";
import { simpleCompare } from "./simple-compare.utils";

export function sortData(sort: Sort, baseData: any[]): any[] {
  const data = baseData.slice();
  if (!sort.active || sort.direction === '') {
    return data;
  }

  return data.sort((a: any, b: any) => {
    console.log('hello', sort, a, b)
    const isAsc = sort.direction === 'asc';
    switch (sort.active) {
      case 'quantity':
        return simpleCompare(a.quantity, b.quantity, isAsc);
      default:
        return 0;
    }
  });
}