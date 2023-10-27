"use client";

import React, { FormEvent, useEffect, useReducer, useState } from "react";
import Stack from "@mui/material/Stack";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import CenterFocusWeakIcon from "@mui/icons-material/CenterFocusWeak";
import { FullCountry, Territory } from "@/utils/types";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DataObjectIcon from "@mui/icons-material/DataObject";
import { Viewer as CViewer } from "cesium";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Modal,
  TextField,
  TextFieldProps,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import SaveIcon from "@mui/icons-material/Save";
import { Viewer, GeoJsonDataSource, CesiumComponentRef } from "resium";
import { Color, EntityCollection } from "cesium";
import dayjs, { Dayjs } from "dayjs";
import ClearIcon from "@mui/icons-material/Clear";
import { DatePicker } from "@mui/x-date-pickers";
import { SchemaType } from "@/utils/types";
import { EditorState } from "@/utils/types";
import { ModelSchema } from "@/utils/types";
import { DATE_FORMAT } from "@/utils/constants";
import GeoJSONViewer from "./GeojsonViewer";
import { GeoJsonObject } from "geojson";

type CountryViewProps = {
  country: FullCountry;
  schema: ModelSchema;
  editorState: EditorState;
};

const extractType = (schema: SchemaType) => {
  const multipleOptions = schema?.anyOf?.reduce<string | undefined>(
    (total, el) => {
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
      return "string";
    },
    "string"
  );

  if (typeof schema == "undefined") {
    return "string";
  }

  if (schema?.format) {
    return schema.format;
  }

  return schema?.type ? schema.type : multipleOptions;
};

// const handleTerritoryUpload = (e: any) => {
//   var reader = new FileReader();
//   reader.onload = (ev: ProgressEvent<FileReader>) => {
//     setSelectedFile(JSON.parse(ev.target.result));
//   };
//   reader.readAsText(e.target.files[0]);
// };

interface TerritoryProps extends Territory {
  uid: string;
  show: boolean;
  cesiumEntityid?: string;
}

const CountryView = ({
  country,
  schema,
  editorState,
}: CountryViewProps): JSX.Element => {
  const [editState, setEditState] = useState(
    editorState ? editorState : EditorState.View
  );

  const [countryFormState, setCountryFormState] = useState<FullCountry>(
    {} as FullCountry
  );
  const [territoriesState, territoriesUpdateEvent] = useReducer(
    (
      prev: Record<string, TerritoryProps>,
      [next, action]: [TerritoryProps, string] | [TerritoryProps]
    ) => {
      const _ = { ...prev };

      switch (action) {
        case "delete":
          delete _[next.uid];
          break;
        case "add":
          _[next.uid] = { ...next };
          break;
        case "reset":
          return {};
        default:
          _[next.uid] = { ...next };
          break;
      }
      return _;
    },
    {}
  );
  const removeTerritoryElement = (uid: string) => {
    const toRemove = territoriesState[uid];
    toRemove
      ? territoriesUpdateEvent([toRemove, "delete"])
      : console.log(`Territory ${uid} not found`);
  };
  useEffect(() => {
    setCountryFormState({ ...country });
    territoriesUpdateEvent([{} as TerritoryProps, "reset"]);
    country.territories.forEach((territory, index) => {
      territoriesUpdateEvent([
        {
          ...territory,
          show: index == 0 ? true : false,
        } as TerritoryProps,
      ]);
    });
  }, [country, schema, editState]);

  const [deleteModalState, setDeleteModalState] = useState(false);

  const router = useRouter();
  const viewerRef = useRef<null | CesiumComponentRef<CViewer>>(null);

  const handleDelete = async () => {
    await fetch(`/api/grenzeit/countries/${countryFormState.uid}/`, {
      method: "DELETE",
    });
    router.push(`countries/`);
  };

  const handleFullCountrySubmit = async (
    country: FullCountry,
    action?: "PUT" | "POST" | undefined
  ) => {
    const verb = action ? action : "PUT";

    // TODO: go over schema, check whats required before sending request
    if (!country.name_eng || !country.name_zeit || !country.founded_at) {
      throw new Error("Yo these should be filled");
    }
    const json_body = JSON.stringify(country);
    const url =
      verb == "PUT"
        ? `/api/grenzeit/countries/${country.uid}`
        : "/api/grenzeit/countries/";
    const response = await fetch(url, {
      method: verb,
      headers: {
        "Content-Type": "application/json",
        "Content-Length": json_body.length.toString(),
      },
      body: json_body,
    });

    if (!response.ok) {
      throw new Error(`something went wrong with ${verb} request`);
    }

    setEditState(EditorState.View);
    return response.text();
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
    const inputType = (schemaType: string): string =>
      (schemaInputMap as any)[schemaType];
    return (
      <>
        <h2 className="text-2xl font-bold">{headerText}</h2>
        <Stack spacing={3}>
          {Object.entries(schema?.properties).map(
            ([propertyName, propertySchema]) => {
              if (hiddenFields.includes(propertyName)) {
                return;
              }
              const fieldLabel = propertySchema?.description || propertyName;
              const fieldValue =
                countryFormState[propertyName as keyof FullCountry];
              const fieldArgs: TextFieldProps = {
                type: inputType(extractType(propertySchema) || "text"),
                id: propertyName,
                disabled: editState == EditorState.View,
                label: fieldLabel,
                variant: "standard",
                fullWidth: true,
                required: schema
                  ? schema.required.includes(propertyName)
                  : false,
                InputProps: {
                  readOnly: editState == EditorState.View,
                },
                onChange: (e: any) =>
                  setCountryFormState({
                    ...countryFormState,
                    [propertyName]: e.target?.value,
                  }),
                value: fieldValue || "",
                placeholder: typeof fieldValue == "string" ? fieldValue : "",
              };
              return (
                <TextField
                  key={propertyName}
                  {...fieldArgs}
                  InputLabelProps={{ shrink: true }}
                />
              );
            }
          )}
        </Stack>
      </>
    );
  };
  const renderButtons = () => {
    const buttonsMap = {
      [EditorState.Edit]: (
        <>
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
            onClick={() => handleFullCountrySubmit(countryFormState, "PUT")}
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
        </>
      ),
      [EditorState.View]: (
        <>
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
              router.push("/countries/add");
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
        </>
      ),
      [EditorState.New]: (
        <>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={() => {
              const createdUid = handleFullCountrySubmit(
                countryFormState,
                "POST"
              );
              // route to created country uid
              router.push(`/countries/${createdUid}`);
            }}
          >
            Save
          </Button>
          <Button
            variant="contained"
            startIcon={<ClearIcon />}
            onClick={() => {
              setEditState(EditorState.New);
              setCountryFormState({} as FullCountry);
              territoriesUpdateEvent([{} as TerritoryProps, "reset"]);
            }}
          >
            Clear
          </Button>
        </>
      ),
    };

    return (
      <Stack spacing={1} direction="row" justifyContent="flex-start">
        {buttonsMap[editState]}
      </Stack>
    );
  };
  const renderTerritories = () => {
    const headerText =
      editState == EditorState.Edit
        ? "Edit Territories"
        : "Territorial changes";
    const removeElement = (uid: string) => {
      if (!(editState == EditorState.View)) {
        return (
          <IconButton
            edge="start"
            aria-label="remove"
            onClick={() => removeTerritoryElement(uid)}
          >
            <RemoveIcon />
          </IconButton>
        );
      } else {
        return <></>;
      }
    };
    return (
      <div className="pb-10">
        <h2 className="text-2xl font-bold">{headerText}</h2>
        <List disablePadding>
          {Object.entries(territoriesState).map((element, index) => {
            const [uid, territory] = element;
            return (
              <div key={uid}>
                <ListItem disablePadding disableGutters>
                  <ListItemText>
                    <h3 className="text-lg">
                      {removeElement(uid)}
                      <span>
                        {`${index + 1}. `}
                        {dayjs(territory?.date_start).format("YYYY") || "Unknown"}
                        {" - "}
                        {dayjs(territory?.date_end).format("YYYY") || "Unknown"}
                      </span>
                    </h3>
                  </ListItemText>
                  <IconButton
                    edge="end"
                    aria-label="object view"
                    onClick={() =>
                      console.log(
                        "TODO: transform territory element to json object field"
                      )
                    }
                  >
                    <DataObjectIcon />
                  </IconButton>
                </ListItem>

                <ListItem className="space-x-2" disablePadding>
                  <DatePicker
                    label="Start"
                    readOnly={editState == EditorState.Edit ? false : true}
                    value={dayjs(territory.date_start)}
                    onChange={(e: dayjs.Dayjs | null) => {
                      const formattedDate = e
                        ? e.format(DATE_FORMAT)
                        : territory.date_start;
                      territoriesUpdateEvent([
                        {
                          ...territoriesState[territory.uid],
                          date_start: formattedDate,
                        } as TerritoryProps,
                      ]);
                      setCountryFormState({
                        ...countryFormState,
                        territories: Object.values(territoriesState),
                      });
                    }}
                  />
                  <DatePicker
                    label="End"
                    readOnly={editState == EditorState.Edit ? false : true}
                    value={dayjs(territory.date_end)}
                    onChange={(e: Dayjs | null) => {
                      const formattedDate = e?.format(DATE_FORMAT) || territory.date_end;
                      territoriesUpdateEvent([
                        {
                          ...territoriesState[territory.uid],
                          date_end: formattedDate,
                        } as TerritoryProps,
                      ]);
                      setCountryFormState({
                        ...countryFormState,
                        territories: Object.values(territoriesState),
                      });
                    }}
                  />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={territoriesState[uid].show}
                      tabIndex={-1}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        territoriesUpdateEvent([
                          {
                            ...territoriesState[uid],
                            show: e.target.checked,
                          } as TerritoryProps,
                        ]);
                        viewerRef?.current?.cesiumElement?.dataSources
                          .getByName(countryFormState.name_eng)
                          .map((t) => (t.show = !territoriesState[uid].show));
                      }}
                    />
                    <IconButton
                      edge="start"
                      onClick={() => {
                        const g =
                          viewerRef?.current?.cesiumElement?.dataSources.getByName(
                            countryFormState.name_eng
                          );
                        g
                          ? viewerRef?.current?.cesiumElement?.zoomTo(
                              g[0].entities
                            )
                          : console.log(
                              "No requested entity in the viewer namespace"
                            );
                      }}
                    >
                      <CenterFocusWeakIcon />
                    </IconButton>
                  </ListItemIcon>
                  <ListItemText>Territory polygon</ListItemText>
                  <IconButton
                    edge="end"
                    onClick={() =>
                      console.log("TODO: download territory as geojson")
                    }
                  >
                    <FileDownloadIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    onClick={() =>
                      console.log("TODO: smol menu on territories")
                    }
                  >
                    <MoreVertIcon />
                  </IconButton>
                </ListItem>
                <Divider />
                <Menu
                  id="basic-menu"
                  anchorEl={null}
                  open={false}
                  onClose={() => console.log("close menu")}
                  MenuListProps={{
                    "aria-labelledby": "basic-button",
                  }}
                >
                  <MenuItem onClick={() => console.log("close menu")}>
                    Profile
                  </MenuItem>
                  <MenuItem onClick={() => console.log("close menu")}>
                    My account
                  </MenuItem>
                  <MenuItem onClick={() => console.log("close menu")}>
                    Logout
                  </MenuItem>
                </Menu>
              </div>
            );
          })}
        </List>
        {(() => {
          if (!(editState == EditorState.View)) {
            return (
              <ListItem disablePadding>
                <ListItemIcon>
                  <Button
                    aria-label="add Territory"
                    startIcon={<AddIcon />}
                    onClick={() => {
                      territoriesUpdateEvent([
                        {
                          uid: `new_${
                            Object.keys(territoriesState).length + 1
                          }`,
                          show: false,
                          geometry: {},
                          date_start: "",
                          date_end: null,
                        } as TerritoryProps,
                      ]);
                    }}
                  >
                    Add Territory
                  </Button>
                </ListItemIcon>
              </ListItem>
            );
          } else {
            return <></>;
          }
        })()}
      </div>
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
    const fillColor = Color.fromAlpha(Color.DARKBLUE, 0.4);
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
        {Object.values(territoriesState).map((territory) => {
          if (!territory.geometry?.coordinates) {
            return undefined;
          }
          return (
            <GeoJsonDataSource
              key={territory.uid}
              data={territory.geometry}
              name={countryFormState?.name_eng}
              onLoad={(g) => {
                viewerRef?.current?.cesiumElement?.zoomTo(g);
                g.entities.values.map((e) => {
                  e.name = countryFormState.name_eng;
                });
              }}
              strokeWidth={0.9}
              stroke={Color.WHITE}
              fill={fillColor}
            />
          );
        })}
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
          {dayjs(countryFormState?.founded_at).format("YYYY") || "Unknown"}-
          {dayjs(countryFormState?.dissolved_at).format("YYYY") || "Unknown"}
        </span>
      </h1>
      <div className="grid grid-cols-3 gap-2 relative">
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
        <GeoJSONViewer
          geojson={{} as GeoJsonObject}
          open={false}
        ></GeoJSONViewer>
      </div>
    </>
  );
};

export default CountryView;
