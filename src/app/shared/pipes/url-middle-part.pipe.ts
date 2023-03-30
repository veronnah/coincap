import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'urlMiddlePart'
})
export class UrlMiddlePartPipe implements PipeTransform {

  /**
   * returns middle part of an url e.g "https://bitcoin.org/" -> "bitcoin.org"
   * @param value
   */
  transform(value: string): string {
    const urlParts = value.replace(/(^\w+:|^)\/\//, '').split(".");
    urlParts.shift();

    return urlParts.join('.').replace(/\/+$/, '');
  }

}
