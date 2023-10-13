"use client";

import "./globals.css";
import { Inter } from "next/font/google";
import { Metadata } from "next";
import "public/cesium/Widgets/widgets.css";
import { Ion } from "cesium";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "Grenzeit",
//   description: "Borders in time",
//   authors: [{ name: "Vlad Tabakov", url: "https://github.com/Wattabak" }],
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  Ion.defaultAccessToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI4NGFlMWMyYS0xMDQxLTQ3ZjQtOTExOC0zZDc0Mjg0YjJhYTQiLCJpZCI6MTcwNjk1LCJpYXQiOjE2OTY3OTgwNjd9.-B91MASeLpOR4xydqXPelCzI0y_pGGR5E9RDcdMgYEs";

  return (
    <html lang="en">
      <body className={inter.className}>
        <main>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className="container mx-auto p-20">{children}</div>
          </LocalizationProvider>
        </main>
      </body>
    </html>
  );
}
