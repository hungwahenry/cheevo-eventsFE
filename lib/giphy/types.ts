export type GiphyGif = {
  id: string;
  title: string | null;
  preview_url: string;
  url: string;
  width: number;
  height: number;
};

export type GiphySearchResponse = {
  items: GiphyGif[];
  offset: number;
  total: number;
};
