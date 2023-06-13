"use client";

import React, { FormEvent, useState } from "react";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { Button } from "@mui/material";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useRouter } from "next/navigation";
import { Input } from "@mui/material";
import { Viewer, Entity } from "resium";
import { Cartesian3 } from "cesium";
import * as Ces from 'cesium' ;

Ces.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiNTcyMWYwMi0yZGQ5LTRmODYtYjhmOS1mYTMzNWIxZGU2ZWEiLCJpZCI6MTAwNTk0LCJpYXQiOjE2NTczMjAzODZ9._CN9Nveo0jvNiWgNDR-B3NKhUWEmbXZS1IQHt_qciCM';

const CountryCreateView = () => {
  const router = useRouter();
  const [name_eng, setname_eng] = useState("");
  const [name_zeit, setname_zeit] = useState("");
  const [founded_at, setfounded_at] = useState(new Date("01-01-2000"));
  const [dissolved_at, setDissolved_at] = useState(new Date("01-01-2000"));

  const handleTerritoryUpload = (e: any) => {
    console.log(e.files[0]);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!name_eng || !name_zeit || !founded_at) {
      throw new Error("Yo these should be filled");
    }
    console.log({
      name_eng,
      name_zeit,
      founded_at,
      dissolved_at,
    });
    const response = await fetch("/api/grenzeit/countries", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name_eng: name_eng,
        name_zeit: name_zeit,
        founded_at: founded_at,
        dissolved_at: dissolved_at,
      }),
    });

    if (!response.ok) {
      throw new Error("something went wrong with POST request");
    }
    router.push("/countries");
  };

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box>
          <h1 className="text-2xl font-bold">New country</h1>
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                type="text"
                id="name_eng"
                label="Name in english"
                variant="standard"
                fullWidth
                required
                value={name_eng}
                onChange={(e) => setname_eng(e.target.value)}
              />
              <TextField
                id="name_zeit"
                label="Name that citizens of that country called themselves"
                variant="standard"
                fullWidth
                required
                value={name_zeit}
                onChange={(e) => setname_zeit(e.target.value)}
              />
              <TextField
                id="founded_at"
                type="date"
                label="Foundation date"
                variant="standard"
                fullWidth
                required
                value={founded_at}
                onChange={(e) => setfounded_at(e.target.value)}
              />
              <TextField
                id="dissolved_at"
                type="date"
                label="Dissolution date"
                variant="standard"
                fullWidth
                value={dissolved_at}
                onChange={(e) => setDissolved_at(e.target.value)}
              />
              <TextField
                type="file"
                id="territory"
                label="Upload"
                variant="standard"
                onChange={(e) => handleTerritoryUpload(e)}
              ></TextField>

              <Button
                variant="contained"
                startIcon={<AddOutlinedIcon />}
                type="submit"
              >
                Save
              </Button>
              <Button
                variant="contained"
                startIcon={<CloseOutlinedIcon />}
                type="submit"
              >
                Save and exit
              </Button>
            </Stack>
          </form>
        </Box>
        <Viewer>
          <Entity
            name="tokyo"
            description="test"
            position={Cartesian3.fromDegrees(139.767052, 35.681167, 100)}
          />
        </Viewer>
      </LocalizationProvider>
    </>
  );
};

export default CountryCreateView;
