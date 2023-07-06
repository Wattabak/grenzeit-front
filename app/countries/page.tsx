"use client";

import React, { useState, useEffect } from "react";
import { Country, PaginatedResponse } from "@/utils/types";
import useSWR from "swr";
import CountriesGrid from "@/components/CountriesGrid";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";

interface CountryListResponse extends PaginatedResponse {
  items: Country[];
}

const fetcher = (...args: any) => fetch(...args).then((res) => res.json());

function useCountries(page: number, size: number) {
  const { data, error, isLoading } = useSWR<CountryListResponse, Error>(
    `/api/grenzeit/countries/?page=${page}&size=${size}`,
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
  const [paginationModel, setPaginationModel] = useState({
    pageSize:  50,
    page: 1,
  });
  const { countries, error, isLoading } = useCountries(paginationModel.page, paginationModel.pageSize);

  const [rowCountState, setRowCountState] = useState(countries?.total || 0);

  useEffect(() => {
    setRowCountState((prevRowCountState) =>
      countries?.total !== undefined ? countries?.total : prevRowCountState
    );
  }, [countries?.total, setRowCountState]);

  const router = useRouter();

  if (error) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data on countries");
  }

  return (
    <>
      <h1 className="text-3xl font-bold">Countries list</h1>
      <CountriesGrid
        countries={countries?.items || []}
        setPaginationModel={setPaginationModel}
        paginationModel={paginationModel}
        rowCountState={rowCountState}
        loading={isLoading}
      ></CountriesGrid>
      <Button
        onClick={() => {
          router.push(`countries/add`);
        }}
        variant="contained"
        startIcon={<AddOutlinedIcon />}
      >
        Create new
      </Button>
    </>
  );
}
