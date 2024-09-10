import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'languagesListPipe'
})
export class LanguagesListPipe implements PipeTransform {
  transform(value: { name: string }[]): any {
    if (value && Array.isArray(value)) {
      return value.map(v => v.name).join(' / ');
    } else {
      return ''
    }
  }
}
