"use client";

import React from "react";
import { EditorState } from "@/utils/types";

import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";
import CountryView from "@/components/CountryView";
import { useFullCountry } from "@/utils/hooks";
import { useSchema } from "@/utils/hooks";

interface CountryProps {
  params: {
    countryId: string;
  };
}

export default function Page({ params }: CountryProps) {
  const router = useRouter();

  const country = useFullCountry(params.countryId);
  const schema = useSchema();
  return (
    <div>
      <IconButton onClick={() => router.push("/countries")}>
        <ArrowBackIcon />
      </IconButton>
      <CountryView
        country={country}
        editorState={EditorState.View}
        schema={schema}
      />
    </div>
  );
}
