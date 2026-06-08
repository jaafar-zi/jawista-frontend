import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'highlight',
  standalone: false,
})
export class HighlightPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string, search: string): SafeHtml {
    if (!search || !value) {
      return value;
    }

    const re = new RegExp(search, 'gi');
    const match = value.match(re);

    if (!match) {
      return value;
    }

    const result = value.replace(re, `<mark class="bg-yellow-200">${match[0]}</mark>`);
    return this.sanitizer.sanitize(1, result) || value;
  }
}