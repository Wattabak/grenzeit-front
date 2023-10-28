"use client";

import React, { useState } from "react";
import SidebarMenu from "./SidebarMenu";
import PublicIcon from "@mui/icons-material/Public";
import TableViewIcon from "@mui/icons-material/TableView";
import BorderAllIcon from "@mui/icons-material/BorderAll";
import {
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { PropsWithChildren } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { useRouter } from "next/navigation";
import { GeoJsonObject } from "geojson";

type GeoJSONViewerProps = {
  open: boolean;
  geojson: GeoJsonObject;
};

const GeoJSONViewer = ({ ...props }: PropsWithChildren<GeoJSONViewerProps>) => {

  return (
    <>
      <div>
        
      </div>
    </>
  );
};

export default GeoJSONViewer;
