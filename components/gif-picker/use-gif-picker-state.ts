import { useGiphySearch, type GiphyGif, type PickedGif } from '@/lib/giphy';
import * as React from 'react';

type Options = {
  onSelect: (gif: PickedGif) => void;
  /** Called after a gif is selected, e.g. to dismiss the sheet. */
  onDone: () => void;
};

export function useGifPickerState({ onSelect, onDone }: Options) {
  const [query, setQuery] = React.useState('');
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    debouncedQuery,
  } = useGiphySearch(query);

  const items = React.useMemo(
    () => data?.pages.flatMap((p) => p.items) ?? [],
    [data]
  );

  const handleSelect = React.useCallback(
    (gif: GiphyGif) => {
      onSelect({
        id: gif.id,
        url: gif.url,
        width: gif.width,
        height: gif.height,
      });
      setQuery('');
      onDone();
    },
    [onSelect, onDone]
  );

  const handleClear = React.useCallback(() => setQuery(''), []);

  return {
    query,
    setQuery,
    items,
    isLoading,
    isError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    debouncedQuery,
    handleSelect,
    handleClear,
  };
}
