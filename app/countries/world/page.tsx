"use client";

import React, { useState } from "react";
import {
  CesiumComponentRef,
  GeoJsonDataSource,
  ImageryLayer,
  Viewer,
} from "resium";
import { DatePicker } from "@mui/x-date-pickers";
import { useRef } from "react";
import { Color, IonImageryProvider } from "cesium";
import { Viewer as CViewer } from "cesium";
import dayjs, { Dayjs } from "dayjs";
import { useWorldCountries } from "@/utils/hooks";

export default function Page() {
  const [showDate, setShowDate] = useState<Dayjs | null>(dayjs("2000-05-05"));
  const viewerRef = useRef<null | CesiumComponentRef<CViewer>>(null);
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

  const countries = useWorldCountries(clusterNames, showDate);

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
    resolutionScale: 0.5,
    imageryProvider: false,
    ref: viewerRef,
  };

  function handleDateChange(newDate: Dayjs | null) {
    viewerRef?.current?.cesiumElement?.dataSources.removeAll();
    // this sucks, but I dont know how to perform this when a rerender is required
    // A proper way would be - whenever the array of counties changes, update accordingly, i.e follow react in rerendering
    // perhaps, I can create a onRemove hook attached to GeoJSONdatasource that would also remove the element from the viewer
    setShowDate(newDate);
  }
  const imageryProvider = IonImageryProvider.fromAssetId(3954, {});

  return (
    <>
      <Viewer {...viewerProps}>
        <ImageryLayer alpha={1} imageryProvider={imageryProvider} />

        <div
          style={{
            position: "absolute",
            top: "0",
            left: "40px",
            width: "25%",
            height: "100%",
          }}
        >
          <div className="sidebar">
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
        {countries?.map((country) => (
          <React.Fragment key={country.uid}>
            <GeoJsonDataSource
              name={country?.name_eng}
              data={
                country.territory?.geometry ? country.territory.geometry : null
              }
              onLoad={(g) => {
                g.entities.values.map((e) => {
                  e.name = country.name_eng;
                });
              }}
              strokeWidth={0.9}
              stroke={Color.WHITE}
              fill={Color.fromRandom()}
            />
          </React.Fragment>
        ))}
      </Viewer>
    </>
  );
}
