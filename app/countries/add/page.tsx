"use client";

import React from "react";
import { Box } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";
import CountryView from "@/components/CountryView";
import { EditorState, FullCountry } from "@/utils/types";
import { useSchema } from "@/utils/hooks";

export default function Page() {
  const router = useRouter();
  const schema = useSchema();
  return (
    <Box>
      <IconButton onClick={() => router.push("/countries")}>
        <ArrowBackIcon />
      </IconButton>
      <CountryView
        country={
          {
            territories: [],
            uid: "",
            founded_at: "",
            name_zeit: "",
            name_eng: "",
          } as FullCountry
        }
        schema={schema}
        editorState={EditorState.New}
      ></CountryView>
    </Box>
  );
}
