import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'trimName'})
export class TrimNamePipe implements PipeTransform {
  transform(value: string, trimLength: number): string {
    if (value.length < trimLength) {
      return value;
    } else {
      return `${value.slice(0, trimLength)}...`;
    }
  }
}
