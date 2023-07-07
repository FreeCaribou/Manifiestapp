import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'categoriesListPipe'
})
export class CategoriesListPipe implements PipeTransform {
  transform(value: string[]): any {
    if (value && Array.isArray(value)) {
      return value.join(', ');
    } else {
      return ''
    }
  }
}
