import { Country, FullCountry, ModelSchema } from "@/utils/types";
import { multiFetcher, singleFetcher } from "./fetchers";
import useSWR, { Fetcher } from "swr";
import { DATE_FORMAT } from "@/utils/constants";
import { Dayjs } from "dayjs";

export function useFullCountry(countryId: string) {
  const { data } = useSWR<FullCountry, Error>(
    `/api/grenzeit/countries/full/${countryId}`,
    singleFetcher
  );
  if (!data) {
    return {
      territories: [],
      uid: "",
      founded_at: "",
      name_zeit: "",
      name_eng: "",
    } as FullCountry;
  }

  return data;
}

export function useSchema() {
  const { data } = useSWR<ModelSchema, Error>(
    `/api/grenzeit/admin/schema/full_country`,
    singleFetcher
  );
  if (!data) {
    return { properties: {} } as ModelSchema;
  }
  return data;
}

export function useWorldCountries(
  clusterNames: string[],
  showDate: Dayjs | null
){
  const convertedDate = showDate ? showDate.format(DATE_FORMAT) : "";
  const clusterMapped = clusterNames.map(
    (n) => `/api/grenzeit/countries/world/${n}?show_date=${convertedDate}`
  );
  const { data } = useSWR<Country[]>(clusterMapped, multiFetcher);

  if (!data) {
    return [];
  }

  return data?.flat();
}
