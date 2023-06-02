"use client";

import React from "react";
import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";
import { Country } from "@/utils/types";
import { useRouter } from "next/navigation";

interface CountriesGridProps {
  countries: Country[];
}
const CountriesGrid = (props: CountriesGridProps) => {
  const router = useRouter();
  const columns: GridColDef[] = [
    { field: "uid", headerName: "uid" },
    { field: "name_eng", headerName: "name_eng" },
    { field: "founded_at", headerName: "founded_at" },
    { field: "dissolved_at", headerName: "dissolved_at" },
    { field: "name_zeit", headerName: "name_zeit" },
  ];

  const rows: GridRowsProp = props.countries.map((c) => {
    return {
      id: c.uid,
      ...c,
    };
  });

  return (
    <div>
      <DataGrid
        columns={columns}
        rows={rows}
        onRowClick={(item) => {
          router.push(`countries/${item.id}`);
        }}
      ></DataGrid>
    </div>
  );
};

export default CountriesGrid;
