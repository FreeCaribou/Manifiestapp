import { formatDate } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { wpDateToRealDate } from '../utils/wp-date-to-real-date';

@Pipe({
  name: 'simpleDatePipe'
})
export class SimpleDatePipe implements PipeTransform {
  transform(value: Date | string, withoutDay: any): any {
    const stringFormat = withoutDay ? 'HH:mm' : 'dd/MM HH:mm';
    if (value && value instanceof Date) {
      return formatDate(value, stringFormat, 'fr');
    } else if (value && typeof value === 'string' && parseFloat(value)) {
      const correctDate = wpDateToRealDate(value);
      return correctDate ? formatDate(correctDate, stringFormat, 'fr') : 'No hour';
    } else {
      return 'No hour'
    }
  }
}
