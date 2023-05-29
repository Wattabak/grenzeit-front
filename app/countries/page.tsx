"use client";

import React from "react";
import { Country, PaginatedResponse } from "@/utils/types";
import useSWR from "swr";
import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  if (error) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data on countries");
  }
  if (isLoading) return <div>Loading ...</div>;

  if (!countries) return <div>Huh</div>;

  const columns: GridColDef[] = [
    { field: "uid", headerName: "uid" },
    { field: "name_eng", headerName: "name_eng" },
    { field: "founded_at", headerName: "founded_at" },
    { field: "dissolved_at", headerName: "dissolved_at" },
    { field: "name_zeit", headerName: "name_zeit" },
  ];

  const rows: GridRowsProp = countries.items.map((item) => {
    return {
      id: item.uid,
      ...item,
    };
  });

  return (
    <>
      <h1 className="text-3xl font-bold">Countries list</h1>
      <DataGrid columns={columns} rows={rows} onRowClick={(item)=>{router.push(`countries/${item.id}`)}}></DataGrid>
    </>
  );
}
