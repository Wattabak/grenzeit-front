"use client";

import React, { useState } from "react";
import Stack from "@mui/material/Stack";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import { Country } from "@/utils/types";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { Viewer, GeoJsonDataSource, CameraFlyTo, Camera, Label, LabelCollection } from "resium";
import { Cartesian3, Color, Transforms } from "cesium";

const CountryView: React.FC<Country> = ({ country }) => {
  const router = useRouter();

  const handleDelete = async () => {
    await fetch(`/api/grenzeit/countries/${country.uid}/`, {
      method: "DELETE",
    });
    router.push(`countries/`);
  };

  return (
    <>
      <h1 className="text-3xl font-bold">{country.name_eng}</h1>
      <ul>
        <Stack spacing={3}>
          {Object.entries(country).map(([k, value]) => {
            if (k == "territory") {
              return <li key={k}></li>;
            }
            return (
              <li key={k}>
                {k}: {value}
              </li>
            );
          })}
        </Stack>
      </ul>
      <Button
        variant="contained"
        startIcon={<EditOutlinedIcon />}
        onClick={() => {
          router.push(`countries/${country.uid}/change`);
        }}
      >
        Edit
      </Button>
      <Button
        variant="contained"
        startIcon={<AddOutlinedIcon />}
        onClick={() => {
          router.push(`countries/add`);
        }}
      >
        Create new
      </Button>
      <Button
        variant="contained"
        startIcon={<DeleteIcon />}
        color="error"
        onClick={handleDelete}
      >
        Delete
      </Button>
      <Viewer>
        <GeoJsonDataSource
          data={country.territory.geometry ? country.territory.geometry : null}
          strokeWidth={0.9}
          stroke={Color.WHITE}
          fill={Color.fromAlpha(Color.DARKBLUE, 0.4)}
        /> 
      </Viewer>
    </>
  );
};

export default CountryView;
