"use client";

import "./globals.css";
import { Inter } from "next/font/google";
import "public/cesium/Widgets/widgets.css";
import { Ion } from "cesium";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  Ion.defaultAccessToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI4NGFlMWMyYS0xMDQxLTQ3ZjQtOTExOC0zZDc0Mjg0YjJhYTQiLCJpZCI6MTcwNjk1LCJpYXQiOjE2OTY3OTgwNjd9.-B91MASeLpOR4xydqXPelCzI0y_pGGR5E9RDcdMgYEs";

  return (
    <html lang="en">
      <body>
        <main>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className="font-sans">{children}</div>
          </LocalizationProvider>
        </main>
      </body>
    </html>
  );
}
