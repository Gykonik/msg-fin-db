// default-value.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'defaultValue',
  standalone: true
})
export class DefaultValuePipe implements PipeTransform {
  transform(value: any, defaultValue: string = '-'): string {
    return value || defaultValue;
  }
}
