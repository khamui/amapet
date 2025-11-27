import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'displayName',
})
export class DisplayNamePipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): unknown {
    const splittedWords = (value as string).split('_').map((word: string) => {
      const capital = word[0].toUpperCase();
      return capital.concat(word.substring(1, word.length));
    });
    return splittedWords.join(' ');
  }
}
