import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'categoriesListPipe'
})
export class CategoriesListPipe implements PipeTransform {
  transform(value: { name: string }[]): any {
    if (value && Array.isArray(value)) {
      return value.map(v => v.name).join(', ');
    } else {
      return ''
    }
  }
}
