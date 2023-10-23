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
import { Viewer, GeoJsonDataSource } from "resium";
import { Color } from "cesium";
import dayjs from "dayjs";
import ClearIcon from "@mui/icons-material/Clear";
import { DatePicker } from "@mui/x-date-pickers";

const EditorState = {
  Edit: "Edit",
  View: "View",
  New: "New",
};

type SchemaType = {
  anyOf: object[] | undefined;
  format: string | undefined;
  type: string | undefined;
  description: string | undefined;
};

type CountryViewProps = {
  country: FullCountry;
  schema: {
    properties: {
      [key: string]: SchemaType;
    };
    required: string[];
  };
  editorState: typeof EditorState;
};

const extractType = (schema: SchemaType) => {
  const multipleOptions = schema?.anyOf?.reduce((total, el) => {
    switch (true) {
      case total == "date":
        return "date";
      case el?.format == "date":
        return "date";
      case el?.format == "date-time":
        return "date";
      case el?.type == "string":
        return "string";
    }
  });
  if (schema.format) {
    return schema.format;
  }
  return schema.type ? schema.type : multipleOptions;
};

const CountryView = ({ country, schema, editorState }: CountryViewProps) => {
  const [countryFormState, setCountryFormState] = useState({});
  const [territoriesState, setTerritoriesState] = useState([]);

  useEffect(() => {
    setCountryFormState({ ...country });
    setTerritoriesState([...country.territories]);
  }, [country, schema]);

  const [editState, setEditState] = useState(
    editorState ? editorState : EditorState.View
  );
  const [deleteModalState, setDeleteModalState] = useState(false);

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
          territories: countryFormState.territories,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("something went wrong with PUT request");
    }

    setEditState(EditorState.View);
  };

  const renderProperties = () => {
    const headerText =
      editState == EditorState.Edit ? "Edit Properties" : "Properties";

    const hiddenFields = ["uid", "territories", "territory"];
    const schemaInputMap = {
      string: "text",
      date: "date",
      datetime: "date",
      array: "text",
    };
    const inputType = (schemaType: string) =>
      (schemaInputMap as any)[schemaType];
    return (
      <>
        <h2 className="text-2xl font-bold">{headerText}</h2>
        <form onSubmit={handleEditSubmit}>
          <Stack spacing={3}>
            {Object.entries(countryFormState).map(([k, value]) => {
              if (hiddenFields.includes(k)) {
                return;
              }
              const fieldLabel = schema?.properties[k].description
                ? schema?.properties[k].description
                : k;
              const fieldArgs = {
                type: inputType(extractType(schema?.properties[k])),
                id: k,
                disabled: editState == EditorState.View,
                label: fieldLabel,
                variant: "standard",
                fullWidth: true,
                clearable: "true",
                required: schema?.required.includes(k),
                InputProps: {
                  readOnly: editState == EditorState.View,
                },
                onChange: (e: Event) =>
                  setCountryFormState({
                    ...countryFormState,
                    [k]: e.target.value,
                  }),
                value: value ? value : "None",
              };
              return <TextField key={k} {...fieldArgs} />;
            })}
          </Stack>
        </form>
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
            onClick={() => setDeleteModalState(true)}
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
            onClick={() => setDeleteModalState(true)}
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
    const headerText =
      editState == EditorState.Edit
        ? "Edit Territories"
        : "Territorial changes";

    return (
      <>
        <h2 className="text-2xl font-bold">{headerText}</h2>
        <List>
          {territoriesState.map((territory: Territory) => {
            return (
              <ListItem key={territory.uid}>
                <ListItemIcon>
                  <ListItemText>1.</ListItemText>
                </ListItemIcon>
                <DatePicker
                  label="Start"
                  readOnly={editState == EditorState.Edit ? false : true}
                  value={dayjs(territory.date_start)}
                  onChange={(e: dayjs.Dayjs) => {
                    const modifiedTerritories = [...territoriesState];
                    modifiedTerritories[territoriesState.indexOf(territory)] = {
                      ...territory,
                      date_start: e.format("YYYY-MM-DD"),
                    };
                    setCountryFormState({
                      ...countryFormState,
                      territories: modifiedTerritories,
                    });
                  }}
                />
                <DatePicker
                  label="End"
                  readOnly={editState == EditorState.Edit ? false : true}
                  value={dayjs(territory.date_end)}
                  onChange={(e: Event) => {
                    const modifiedTerritories = [...territoriesState];
                    modifiedTerritories[territoriesState.indexOf(territory)] = {
                      ...territory,
                      date_end: e.format("YYYY-MM-DD"),
                    };
                    setCountryFormState({
                      ...countryFormState,
                      territories: modifiedTerritories,
                    });
                  }}
                />
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
          position: "fixed",
          top: "0",
          width: "65%",
          height: "100%",
        }}
      >
        <GeoJsonDataSource
          data={
            countryFormState.territories ? countryFormState.territories[0]?.geometry : null
          }
          name={country?.name_eng}
          onLoad={(g) => {
            viewerRef.current.cesiumElement.zoomTo(g);
            g.entities.values.map((e) => {
              e.name = countryFormState.name_eng;
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
      <Modal open={deleteModalState} onClose={() => setDeleteModalState(false)}>
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            You are trying to delete Country object {country?.name_eng}
          </Typography>
          <Typography id="modal-modal-description" sx={{ my: 2 }}>
            Are you sure you want to proceed? This change cannot be reversed
          </Typography>
          <Button onClick={handleDelete}>Yes</Button>
          <Button onClick={() => setDeleteModalState(false)}>No</Button>
        </Box>
      </Modal>
      <h1 className="text-3xl font-bold">
        <span className="break-words">{countryFormState?.name_eng}</span>
        <span className="block text-lg">
          {dayjs(country?.founded_at).format("YYYY")}-
          {countryFormState?.dissolved_at
            ? dayjs(countryFormState.dissolved_at).format("YYYY")
            : "Unknown"}
        </span>
      </h1>
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-1">
          {renderProperties()}
          {renderTerritories()}
          {renderButtons()}
        </div>
        <div
          className="col-span-2 h-full"
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "65%",
            height: "100%",
          }}
        >
          {renderViewer()}
        </div>
      </div>
    </>
  );
};

export default CountryView;
