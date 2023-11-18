// german-date.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'germanDate',
  standalone: true
})
export class GermanDatePipe implements PipeTransform {
  transform(value: Date | string): string | null {
    return new DatePipe('de-DE').transform(value, 'dd.MM.yyyy HH:mm:ss');
  }
}
