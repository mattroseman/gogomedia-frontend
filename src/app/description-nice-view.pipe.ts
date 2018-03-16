import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'descriptionNiceView'})
export class DescriptionNiceViewPipe implements PipTransform {
  transform(value: string): string {
    // TODO convert newlines to <br>
    // TODO make links clickable

    return value;
  }
}
