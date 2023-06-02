"use client";

import React from "react";
import { Country } from "@/utils/types";
import { Button } from "@mui/material";
import useSWR from "swr";

const fetcher = (...args: any) => fetch(...args).then((res) => res.json());

interface CountryProps {
  params: {
    countryId: string;
  };
}
const apiHost = `${process.env.NEXT_PUBLIC_GRENZEIT_API_SCHEME}://${process.env.NEXT_PUBLIC_GRENZEIT_API_HOST}/api/latest/`;

function useCountry(countryId: string) {
  const { data, error, isLoading } = useSWR<Country, Error>(
    `/api/grenzeit/countries/${countryId}`,
    fetcher
  );

  return {
    country: data,
    error,
    isLoading,
  };
}

export default function Page({ params }: CountryProps) {
  const { country, error, isLoading } = useCountry(params.countryId);
  if (error) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error(`Failed to fetch country ${params.countryId}`);
  }

  if (isLoading) return <div>Loading ...</div>;
  console.log(country);
  if (!country) return <div>Huh</div>;

  return (
    <div>
      <h1>{country.name_eng}</h1>
      <ul>
        {Object.entries(country).map(([k, value]) => {
          return (
            <li key={k}>
              {k}: {value}
            </li>
          );
        })}
      </ul>
      {/* <Button action={}>Edit</Button> */}
    </div>
  );
}
