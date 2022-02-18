import { formatDate } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { wpDateToRealDate } from '../utils/wp-date-to-real-date';

// TODO params to have yes or no the dd/MM also
@Pipe({
  name: 'simpleDatePipe'
})
export class SimpleDatePipe implements PipeTransform {
  transform(value: Date | string, args: any[] = []): any {
    if (value && value instanceof Date) {
      return formatDate(value, 'dd/MM HH:mm', 'en', '+00');
    } else if (value && typeof value === 'string' && parseFloat(value)) {
      // GMT +00 because the back wp do not look like to manage this kind of thing
      const correctDate = wpDateToRealDate(value);
      return correctDate ? formatDate(correctDate, 'dd/MM HH:mm', 'en', '+00') : 'No hour';
    } else {
      return 'No hour'
    }
  }
}