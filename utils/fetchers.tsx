import { Fetcher } from "swr";

export const singleFetcher: Fetcher<any> = (args: RequestInfo | URL) =>
  fetch(args)
    .then((res) => res.json())
    .catch((e) => console.error(e));

export async function multiFetcher(urlArr: string[]): Promise<any> {
  const f = (u: string) => fetch(u).then((r) => r.json());
  return await Promise.all(urlArr.map(f)).catch((err) => console.log(err));
}
