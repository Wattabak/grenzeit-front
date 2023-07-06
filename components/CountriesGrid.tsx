"use client";

import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";
import { Country } from "@/utils/types";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface CountriesGridProps {
  countries: Country[];
  setPaginationModel: any;
  paginationModel: any;
  rowCountState: any;
  loading: boolean;
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
        rowCount={props.rowCountState}
        onRowClick={(item) => {
          router.push(`countries/${item.id}`);
        }}
        paginationModel={props.paginationModel}
        onPaginationModelChange={props.setPaginationModel}
        paginationMode="server"
        loading={props.loading}
      ></DataGrid>
    </div>
  );
};

export default CountriesGrid;
