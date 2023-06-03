"use client"

import React from "react";
import { Box } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";
import CountryEditView from "@/components/CountryEditView";
import useSWR from "swr";
import { Country } from "@/utils/types";

interface CountryProps {
  params: {
    countryId: string;
  };
}

const fetcher = (...args: any) => fetch(...args).then((res) => res.json());

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
  const router = useRouter();

  const { country, error, isLoading } = useCountry(params.countryId);

  if (error) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error(`Failed to fetch country ${params.countryId}`);
  }

  if (isLoading) return <div>Loading ...</div>;
  console.log(country);
  if (!country) return <div>Huh</div>;
  return (
    <Box>
      <IconButton onClick={() => router.push("/countries")}>
        <ArrowBackIcon />
      </IconButton>
      <CountryEditView country={country} />
    </Box>
  );
}
