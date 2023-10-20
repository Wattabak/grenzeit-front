"use client";

import React, { FormEvent, useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import { FullCountry, Territory } from "@/utils/types";
import {
  Box,
  Button,
  Checkbox,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import SaveIcon from "@mui/icons-material/Save";
import { Viewer, GeoJsonDataSource, EdgeDetectionStage } from "resium";
import { Color } from "cesium";
import dayjs from "dayjs";
import ClearIcon from "@mui/icons-material/Clear";

const EditorState = {
  Edit: "Edit",
  View: "View",
  New: "New",
};

const CountryView: React.FC<FullCountry> = ({ country, editorState }) => {
  const [countryFormState, setCountryFormState] = useState({ ...country });

  useEffect(() => {
    // action on update of movies
    setCountryFormState({ ...country });
  }, [country]);

  const [editState, setEditState] = useState(
    editorState ? editorState : EditorState.View
  );
  const [modalState, setModalState] = useState(false);

  const router = useRouter();
  const viewerRef = useRef();

  const handleDelete = async () => {
    await fetch(`/api/grenzeit/countries/${countryFormState.uid}/`, {
      method: "DELETE",
    });
    router.push(`countries/`);
  };

  const handleEditSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (
      !countryFormState.name_eng ||
      !countryFormState.name_zeit ||
      !countryFormState.founded_at
    ) {
      throw new Error("Yo these should be filled");
    }

    const response = await fetch(
      `/api/grenzeit/countries/${countryFormState.uid}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name_eng: countryFormState.name_eng,
          name_zeit: countryFormState.name_zeit,
          founded_at: countryFormState.founded_at,
          dissolved_at: countryFormState.dissolved_at,
          cluster: countryFormState.cluster,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("something went wrong with PUT request");
    }

    setEditState(EditorState.View);
  };

  const renderProperties = () => {
    if (editState == EditorState.Edit) {
      return (
        <>
          <h2 className="text-2xl font-bold">Edit Properties</h2>
          <form onSubmit={handleEditSubmit}>
            <Stack spacing={3}>
              <TextField
                type="text"
                id="name_eng"
                label="Name in english"
                variant="standard"
                fullWidth
                required
                value={countryFormState.name_eng}
                onChange={(e) =>
                  setCountryFormState({
                    ...countryFormState,
                    name_eng: e.target.value,
                  })
                }
              />
              <TextField
                id="name_zeit"
                label="Name that citizens of that country called themselves"
                variant="standard"
                fullWidth
                required
                value={countryFormState.name_zeit}
                onChange={(e) =>
                  setCountryFormState({
                    ...countryFormState,
                    name_zeit: e.target.value,
                  })
                }
              />
              <TextField
                id="founded_at"
                type="date"
                label="Foundation date"
                variant="standard"
                fullWidth
                required
                value={countryFormState.founded_at}
                onChange={(e) =>
                  setCountryFormState({
                    ...countryFormState,
                    founded_at: e.target.value,
                  })
                }
              />
              <TextField
                id="dissolved_at"
                type="date"
                label="Dissolution date"
                variant="standard"
                fullWidth
                value={countryFormState?.dissolved_at}
                onChange={(e) =>
                  setCountryFormState({
                    ...countryFormState,
                    dissolved_at: e.target.value,
                  })
                }
              />
            </Stack>
          </form>
        </>
      );
    }

    return (
      <>
        <h2 className="text-2xl font-bold">Properties</h2>

        <ul className="list-none p-0">
          <Stack spacing={3}>
            {Object.entries(countryFormState).map(([k, value]) => {
              if (k == "territories") {
                return <li key={k}></li>;
              }
              return (
                <li key={k}>
                  {k}: {value ? value : "None"}
                </li>
              );
            })}
          </Stack>
        </ul>
      </>
    );
  };
  const renderButtons = () => {
    if (editState == EditorState.Edit) {
      return (
        <Stack spacing={1} direction="row" justifyContent="flex-start">
          <Button
            variant="contained"
            startIcon={<ClearIcon />}
            onClick={() => {
              setEditState(EditorState.View);
            }}
          >
            Clear
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            type="submit"
            onClick={handleEditSubmit}
          >
            Save
          </Button>

          <Button
            variant="contained"
            startIcon={<DeleteIcon />}
            color="error"
            onClick={() => setModalState(true)}
          >
            Delete
          </Button>
        </Stack>
      );
    } else if (editState == EditorState.View) {
      return (
        <Stack spacing={1} direction="row" justifyContent="flex-start">
          <Button
            variant="contained"
            startIcon={<EditOutlinedIcon />}
            onClick={() => {
              setEditState(EditorState.Edit);
            }}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            startIcon={<AddOutlinedIcon />}
            onClick={() => {
              setEditState(EditorState.New);
            }}
          >
            Create
          </Button>
          <Button
            variant="contained"
            startIcon={<DeleteIcon />}
            color="error"
            onClick={() => setModalState(true)}
          >
            Delete
          </Button>
        </Stack>
      );
    } else {
      return (
        <Stack spacing={1} direction="row" justifyContent="flex-start">
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={() => {
              // save form state, route to new page
              setEditState(EditorState.View);
            }}
          >
            Save
          </Button>
          <Button
            variant="contained"
            startIcon={<ClearIcon />}
            onClick={() => {
              // clear form state here, stay in new
            }}
          >
            Clear
          </Button>
        </Stack>
      );
    }
  };
  const renderTerritories = () => {
    return (
      <>
        <List
          sx={{
            width: "100%",
            maxWidth: 360,
            bgcolor: "background.paper",
            position: "relative",
            overflow: "auto",
            maxHeight: 300,
            "& ul": { padding: 0 },
          }}
        >
          {country.territories.map((territory: Territory) => {
            return (
              <ListItem key={territory.uid}>
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={false}
                    tabIndex={-1}
                    disableRipple
                  />
                </ListItemIcon>
                <ListItemText>
                  {dayjs(territory.date_start).format("YYYY/MM/DD")} -{" "}
                  {dayjs(territory.date_end).format("YYYY/MM/DD")}
                </ListItemText>
              </ListItem>
            );
          })}
        </List>
      </>
    );
  };
  const modalStyle = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const renderViewer = () => {
    const viewerProps = {
      full: false,
      timeline: false,
      animation: false,
      baseLayerPicker: false,
      geocoder: false,
      homeButton: false,
      fullscreenButton: false,
      sceneModePicker: false,
      navigationHelpButton: false,
      ref: viewerRef,
    };

    return (
      <Viewer
        {...viewerProps}
        style={{
          position: "absolute",
          top: "0",
          width: "65%",
          height: "100%",
        }}
      >
        <GeoJsonDataSource
          data={
            country.territories[0]?.geometry
              ? country.territories[0]?.geometry
              : null
          }
          name={country?.name_eng}
          onLoad={(g) => {
            viewerRef.current.cesiumElement.zoomTo(g);
            g.entities.values.map((e) => {
              e.name = country.name_eng;
            });
          }}
          strokeWidth={0.9}
          stroke={Color.WHITE}
          fill={Color.fromAlpha(Color.DARKBLUE, 0.4)}
        />
      </Viewer>
    );
  };

  return (
    <>
      <Modal open={modalState} onClose={() => setModalState(false)}>
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            You are trying to delete Country object {country?.name_eng}
          </Typography>
          <Typography id="modal-modal-description" sx={{ my: 2 }}>
            Are you sure you want to proceed? This change cannot be reversed
          </Typography>
          <Button onClick={handleDelete}>Yes</Button>
          <Button onClick={() => setModalState(false)}>No</Button>
        </Box>
      </Modal>
      <h1 className="text-3xl font-bold">
        {country?.name_eng}, {dayjs(country?.founded_at).format("YYYY")}-
        {country?.dissolved_at
          ? dayjs(countryFormState.dissolved_at).format("YYYY")
          : "Unknown"}
      </h1>
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-1">
          {renderProperties()}
          <h2 className="text-2xl font-bold">Territorial changes</h2>
          {renderTerritories()}
          {renderButtons()}
        </div>
        <div className="col-span-2">
          <div>{renderViewer()}</div>
        </div>
      </div>
    </>
  );
};

export default CountryView;
