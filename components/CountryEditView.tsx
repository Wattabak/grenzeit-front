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
import { Country } from "@/utils/types";
import DeleteIcon from "@mui/icons-material/Delete";

const CountryEditView: React.FC<Country> = ({ country }) => {
  const router = useRouter();

  const [name_eng, setname_eng] = useState(country.name_eng);
  const [name_zeit, setname_zeit] = useState(country.name_zeit);
  const [founded_at, setfounded_at] = useState(country.founded_at);
  const [dissolved_at, setDissolved_at]   = useState(country.dissolved_at);

  const handleDelete = async () => {
    await fetch(`/api/grenzeit/countries/${country.uid}/`, {
      method: "DELETE",
    });
    router.push(`countries/`);
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
    const response = await fetch(`/api/grenzeit/countries/${country.uid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name_eng: name_eng,
        name_zeit: name_zeit,
        founded_at: founded_at,
        dissolved_at: dissolved_at,
        cluster: country.cluster,
      }),
    });

    if (!response.ok) {
      throw new Error("something went wrong with PUT request");
    }
    router.push(`/countries/${country.uid}`);
  };

  return (
    <>
      <Box>
        <h1 className="text-2xl font-bold">Edit country</h1>
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
            <Button
              variant="contained"
              startIcon={<DeleteIcon />}
              color="error"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </Stack>
        </form>
      </Box>
    </>
  );
};

export default CountryEditView;
