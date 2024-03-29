"use client";

import React from "react";
import { EditorState } from "@/utils/types";

import CountryView from "@/components/CountryView";
import { useFullCountry } from "@/utils/hooks";
import { useSchema } from "@/utils/hooks";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { Link, Typography } from "@mui/material";

interface CountryProps {
  params: {
    countryId: string;
  };
}

export default function Page({ params }: CountryProps) {
  const { data: country, error } = useFullCountry(params.countryId);
  const schema = useSchema();
  const content = () => {
    if (error) {
      return `${error?.status || ""} Not found`;
    }
    return (
      <CountryView
        country={country}
        editorState={EditorState.View}
        schema={schema}
      />
    );
  };

  return (
    <div className="py-10">
      <div>
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" color="inherit" href="/countries">
            Countries
          </Link>
          <Typography color="text.primary">{country.name_eng}</Typography>
        </Breadcrumbs>
      </div>

      {content()}
    </div>
  );
}
