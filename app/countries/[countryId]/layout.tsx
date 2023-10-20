"use client";

import "public/cesium/Widgets/widgets.css";
import {
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import PublicIcon from "@mui/icons-material/Public";
import TableViewIcon from "@mui/icons-material/TableView";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import BorderAllIcon from '@mui/icons-material/BorderAll';
import { useRouter } from 'next/navigation'

export default function Layout({ children }: { children: React.ReactNode }) {
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
      <Drawer
        id="sidebar-menu"
        variant="temporary"
        ModalProps={{
          keepMounted: false,
        }}
        open={state}
        anchor="left"
        onClose={toggleDrawer(false)}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: 1,
            justifyContent: "flex-end",
          }}
        >
          <IconButton onClick={toggleDrawer(false)}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
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
      </Drawer>
      <IconButton aria-label="menu" onClick={toggleDrawer(true)}>
        <MenuIcon />
      </IconButton>
      <div className="container mx-auto px-20">{children}</div>
    </>
  );
}
