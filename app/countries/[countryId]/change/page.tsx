"use client";

import React from "react";
import { Box } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";
import CountryView from "@/components/CountryView";
import { EditorState } from "@/utils/types";
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
    <Box>
      <IconButton onClick={() => router.push("/countries")}>
        <ArrowBackIcon />
      </IconButton>
      <CountryView
        country={country}
        editorState={EditorState.Edit}
        schema={schema}
      />
    </Box>
  );
}
