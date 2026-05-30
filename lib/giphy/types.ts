export type GiphyGif = {
  id: string;
  title: string | null;
  preview_url: string;
  url: string;
  width: number;
  height: number;
};

export type PickedGif = Pick<GiphyGif, 'id' | 'url' | 'width' | 'height'>;

export type GiphySearchResponse = {
  items: GiphyGif[];
  offset: number;
  total: number;
};
