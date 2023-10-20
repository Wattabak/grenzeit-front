"use client";

import React from "react";
import { FullCountry } from "@/utils/types";
import useSWR from "swr";

import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";
import CountryView from "@/components/CountryView";

interface CountryProps {
  params: {
    countryId: string;
  };
}

const fetcher = (...args: any) =>
  fetch(...args)
    .then((res) => res.json())
    .catch((err) => console.log(err));

function useCountry(countryId: string) {
  const { data, error, isLoading } = useSWR<FullCountry, Error>(
    `/api/grenzeit/countries/full/${countryId}`,
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

  return (
    <div>
      <IconButton onClick={() => router.push("/countries")}>
        <ArrowBackIcon />
      </IconButton>
      <CountryView
        country={typeof country != "undefined" ? country : {territories: []}}
        editorState={"View"}
      />
    </div>
  );
}
