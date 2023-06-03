"use client";

import React, {useState} from "react";
import Stack from "@mui/material/Stack";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { Country } from "@/utils/types";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";

const CountryView: React.FC<Country> = ({country}) => {
  const router = useRouter();

  return (
    <>
      <h1 className="text-3xl font-bold">{country.name_eng}</h1>
      <ul>
        <Stack spacing={3}>
          {Object.entries(country).map(([k, value]) => {
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
    </>
  );
};

export default CountryView;
