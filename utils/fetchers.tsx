import { Fetcher } from "swr";
import { BareFetcher, FetcherResponse } from "swr/_internal";

export const singleFetcher: Fetcher<any> = (args: RequestInfo | URL) => {
  return fetch(args)
    .then((res) => res.json())
    .catch((e) => console.error(e));
};

export const multiFetcher: BareFetcher<any[]> = (
  urlArr: string[]
) => {
  return Promise.all(urlArr.map((url) => singleFetcher(url)));
};
