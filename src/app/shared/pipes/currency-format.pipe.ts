// shared/pipes/currency-format.pipe.ts

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyFormat',
  standalone: false
})
export class CurrencyFormatPipe implements PipeTransform {
  transform(value: number | null | undefined, symbol: string = 'R'): string {
    if (value == null) {
      return `${symbol} 0.00`;
    }
    return `${symbol} ${value.toFixed(2)}`;
  }
}