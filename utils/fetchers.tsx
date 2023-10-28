import { Fetcher } from "swr";
import { BareFetcher, FetcherResponse } from "swr/_internal";

export class FetchError extends Error {
  status?: number

  constructor(message: string, status: number) {
    super(message);
    this.status = status
  }
}

export const singleFetcher: Fetcher<any> = async (args: RequestInfo | URL) => {
  const res = await fetch(args);

  if (!res.ok) {
    throw new FetchError(
      "An error occurred while fetching the data.",
      res.status,
    );
  }
  return res.json();
};

export const multiFetcher: BareFetcher<any[]> = (urlArr: string[]) => {
  return Promise.all(urlArr.map((url) => singleFetcher(url)));
};
