import { formatDate } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'simpleDatePipe'
})
export class SimpleDatePipe implements PipeTransform {
  transform(value: Date | string, args: any[] = []): any {
    if (value && value instanceof Date) {
      return formatDate(value, 'dd/MM hh:mm', 'en');
    } else {
      return 'No date'
    }
  }
}