import { formatDate } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'simpleDatePipe'
})
export class SimpleDatePipe implements PipeTransform {
  transform(value: Date, args: any[]): any {
    return formatDate(value, 'dd/MM hh:mm', 'en');
  }
}