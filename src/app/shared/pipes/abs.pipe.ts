import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'abs'
})
export class AbsPipe implements PipeTransform {

  /**
   * returns the absolute value of a number
   * @param num
   */
  transform(num: number): number {
    return Math.abs(num);
  }

}
