import type { GiphyGif } from '@/lib/giphy';

/**
 * Distribute gifs into two columns by accumulated unit-height so each column
 * stays roughly balanced.
 */
export function splitMasonry(items: GiphyGif[]): [GiphyGif[], GiphyGif[]] {
  const left: GiphyGif[] = [];
  const right: GiphyGif[] = [];
  let leftHeight = 0;
  let rightHeight = 0;

  for (const gif of items) {
    const aspect = gif.height > 0 ? gif.width / gif.height : 1;
    const unitHeight = 1 / aspect;
    if (leftHeight <= rightHeight) {
      left.push(gif);
      leftHeight += unitHeight;
    } else {
      right.push(gif);
      rightHeight += unitHeight;
    }
  }
  return [left, right];
}
