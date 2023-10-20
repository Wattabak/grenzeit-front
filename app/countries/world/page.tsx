"use client";

import React, { useState, useEffect } from "react";
import { Cluster, Country } from "@/utils/types";
import useSWR from "swr";
import { IconButton } from "@mui/material";
import { useRouter } from "next/navigation";
import { GeoJsonDataSource, Viewer } from "resium";
import { DatePicker } from "@mui/x-date-pickers";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MenuIcon from "@mui/icons-material/Menu";
import { useRef } from 'react';
import {
  Color,
  PropertyBag,
  LabelGraphics,
  LabelStyle,
  Terrain,
} from "cesium";
import dayjs, { Dayjs } from "dayjs";

// const fetcher = (...args: any) => fetch(...args).then((res) => res.json());

async function multiFetcher(urlArr: string[]) {
  const f = (u: string) => fetch(u).then((r) => r.json());
  return await Promise.all(urlArr.map(f)).catch((err) => console.log(err));
}

function useClusters(clusterNames: string[], showDate: dayjs.Dayjs) {
  const { data, error, isLoading } = useSWR<Country[], Error>(
    clusterNames.map(
      (n) =>
        `/api/grenzeit/countries/world/${n}?show_date=${
          showDate.toISOString().split("T")[0]
        }`
    ),
    multiFetcher
  );

  return {
    countries: data?.flat(),
    error,
    isLoading,
  };
}

export default function Page() {
  const [showDate, setShowDate] = useState(dayjs("2000-05-05"));
  const viewerRef = useRef();
  const clusterNames = [
    "Europe",
    "Asia",
    // "Africa",
    // "South America",
    // "North America",
    // "Oceania",
    // "Antarctica",
    // "Australia",
  ];

  const { countries, error, isLoading } = useClusters(clusterNames, showDate);

  const router = useRouter();

  const viewerProps = {
    full: true,
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

  function handleDateChange(newDate: Dayjs | null) {
    viewerRef?.current?.cesiumElement.dataSources.removeAll()
    // this sucks, but I dont know how to perform this when a rerender is required
    // A proper way would be - whenever the array of counties changes, update accordingly, i.e follow react in rerendering 
    // perhaps, I can create a onRemove hook attached to GeoJSONdatasource that would also remove the element from the viewer
    setShowDate(newDate);
  }
  return (
    <>
      <Viewer {...viewerProps}>
        <div
          className="text-3xl font-bold"
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            width: "25%",
            height: "100%",
          }}
        >
          <div className="sidebar">
            <IconButton onClick={() => console.log("route to menu")}>
              <MenuIcon className="text-white" />
            </IconButton>
            <IconButton onClick={() => router.push("/countries")}>
              <ArrowBackIcon className="text-white" />
            </IconButton>
            <h1 className="text-white text-3xl">World map</h1>
            {/* needs a custom-made component to handle BC dates and more */}
            <DatePicker
              defaultValue={dayjs(showDate)}
              onChange={(newDate) => handleDateChange(newDate)}
              minDate={dayjs("1000-01-01")}
              className="bg-white"
            />
          </div>
        </div>
        {
          countries?.map((country) => (
            <React.Fragment key={country.uid}>
              <GeoJsonDataSource
                name={country?.name_eng}
                data={country.territory?.geometry ? country.territory.geometry : null}
                onLoad={(g) => {
                  g.entities.values.map((e) => {
                    e.name = country.name_eng;
                    e.properties = new PropertyBag({
                      name_zeit: country.name_zeit,
                      founded_at: country.founded_at,
                      dissolved_at: country.dissolved_at,
                      uid: country.uid,
                    });
                    e.label = new LabelGraphics({
                      text: country.name_eng,
                      show: true,
                      fillColor: Color.BLACK,
                      font: "24px Arial",
                      scale: 1,
                      style: LabelStyle.FILL,
                    });
                  });
                }}
                strokeWidth={0.9}
                stroke={Color.WHITE}
                fill={Color.fromRandom()}
              />
            </React.Fragment>
          ))
        }
      </Viewer>
    </>
  );
}
