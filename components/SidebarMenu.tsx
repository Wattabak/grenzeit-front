"use client";

import { Drawer, IconButton } from "@mui/material";
import React, { EventHandler } from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { PropsWithChildren } from "react";

type SidebarProps = {
  state: boolean;
  stateHandler: Function
};

const SidebarMenu = ({ ...props }: PropsWithChildren<SidebarProps>) => {
  return (
    <Drawer
      id="sidebar-menu"
      variant="temporary"
      ModalProps={{
        keepMounted: false,
      }}
      open={props.state}
      anchor="left"
      onClose={props.stateHandler(false)}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: 1,
          justifyContent: "flex-end",
        }}
      >
        <IconButton onClick={props.stateHandler(false)}>
          <ChevronLeftIcon />
        </IconButton>
      </div>
      {props.children}
    </Drawer>
  );
};

export default SidebarMenu;
