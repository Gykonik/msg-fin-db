// german-currency.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';
import {Utils} from "../utils/utils";

@Pipe({
  name: 'germanCurrency',
  standalone: true
})
export class GermanCurrencyPipe implements PipeTransform {
  transform(value: number): string {
    const sign: "" | "+" | "-" = Utils.getCurrencyPrefix(value);
    const absValue: number = Math.abs(value);
    const formattedNumber: string = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(absValue);
    return `${sign} ${formattedNumber}`;
  }
}
