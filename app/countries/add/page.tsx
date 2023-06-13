"use client"

import React from "react";
// import CountryCreateView from "@/components/CountryCreateView";
import { Box } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";
import dynamic from 'next/dynamic'

const CountryCreateView = dynamic(
  () => import('@/components/CountryCreateView'),
  { ssr: false }
)

export default function Page() {
  const router = useRouter();

  return (
    <Box>
      <IconButton onClick={() => router.push("/countries")}>
        <ArrowBackIcon />
      </IconButton>
      <CountryCreateView></CountryCreateView>
    </Box>
  );
}
