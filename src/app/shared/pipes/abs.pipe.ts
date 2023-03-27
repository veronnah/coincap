import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'abs'
})
export class AbsPipe implements PipeTransform {

  /**
   * returns the absolute value of a number
   * @param num
   * @param args
   */
  transform(num: number, args?: any): any {
    return Math.abs(num);
  }

}
