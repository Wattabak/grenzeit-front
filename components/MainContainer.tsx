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

type MainContainerProps = {};

const MainContainer = ({ ...props }: PropsWithChildren<MainContainerProps>) => {
  const [state, setState] = useState(false);

  const router = useRouter();

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setState(!state);
    };

  return (
    <>
      <SidebarMenu state={state} stateHandler={toggleDrawer}>
        <List>
          <ListItem>
            <ListItemButton onClick={() => router.push("/countries/world")}>
              <ListItemIcon>
                <PublicIcon />
              </ListItemIcon>
              <ListItemText primary={"World map"} />
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton onClick={() => router.push("/countries")}>
              <ListItemIcon>
                <TableViewIcon />
              </ListItemIcon>
              <ListItemText primary={"Countries Grid"} />
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton onClick={() => router.push("/clusters")}>
              <ListItemIcon>
                <BorderAllIcon />
              </ListItemIcon>
              <ListItemText primary={"Clusters view"} />
            </ListItemButton>
          </ListItem>
        </List>
      </SidebarMenu>
      <IconButton aria-label="menu" onClick={toggleDrawer(true)}>
        <MenuIcon />
      </IconButton>
      <div>{props.children}</div>
    </>
  );
};

export default MainContainer;
