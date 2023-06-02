"use client";

import React from "react";
import { Country, PaginatedResponse } from "@/utils/types";
import useSWR from "swr";
import CountriesGrid from "@/components/CountriesGrid";

interface CountryListResponse extends PaginatedResponse {
  items: Country[];
}

const fetcher = (...args: any) => fetch(...args).then((res) => res.json());

function useCountries() {
  const { data, error, isLoading } = useSWR<CountryListResponse, Error>(
    "/api/grenzeit/countries",
    fetcher
  );

  return {
    countries: data,
    error,
    isLoading,
  };
}

interface CountryListProps {
  params: {
    countryId: string;
  };
}

export default function Page({ params }: CountryListProps) {
  const { countries, error, isLoading } = useCountries();

  if (error) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data on countries");
  }
  if (isLoading) return <div>Loading ...</div>;

  if (!countries) return <div>Huh</div>;

  return (
    <>
      <h1 className="text-3xl font-bold">Countries list</h1>
      <CountriesGrid countries={countries.items}></CountriesGrid>
    </>
  );
}
