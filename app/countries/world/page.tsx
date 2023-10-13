"use client";

import React, { useState, useEffect } from "react";
import { Cluster, Country } from "@/utils/types";
import useSWR from "swr";
import CountriesGrid from "@/components/CountriesGrid";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { Button, IconButton } from "@mui/material";
import { useRouter } from "next/navigation";
import { Entity, GeoJsonDataSource, Viewer } from "resium";
import { DatePicker } from "@mui/x-date-pickers";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MenuIcon from '@mui/icons-material/Menu';
import {
  BoundingSphere,
  Cartesian3,
  Color,
  PropertyBag,
  Label,
  LabelGraphics,
  LabelStyle,
} from "cesium";
import dayjs from "dayjs";

// const fetcher = (...args: any) => fetch(...args).then((res) => res.json());

async function multiFetcher(urlArr: string[]) {
  const f = (u) => fetch(u).then((r) => r.json());
  return await Promise.all(urlArr.map(f)).catch((err) => console.log(err));
}

function useClusters(clusterNames: string[]) {
  const { data, error, isLoading } = useSWR<Country[], Error>(
    clusterNames.map((n) => `/api/grenzeit/countries/world/${n}`),
    multiFetcher
  );
  return {
    countries: data?.flat(),
    error,
    isLoading,
  };
}

interface ClusterListProps {
  params: {
    countryId: string;
  };
}

export default function Page({ params }: ClusterListProps) {
  const showDate = new Date("2000-01-01T00:00:00");

  const { countries, error, isLoading } = useClusters([
    "Europe",
    "Asia",
    // "Africa",
    // "South America",
    // "North America",
    // "Oceania",
    // "Antarctica",
    // "Australia",
  ]);

  // const [rowCountState, setRowCountState] = useState(clusters.clusters.length || 0);

  const router = useRouter();

  if (error) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data on countries");
  }
  const props = {
    full: true,
    timeline: false,
    animation: false,
    baseLayerPicker: false,
    geocoder: false,
    homeButton: false,
    fullscreenButton: false,
    sceneModePicker: false,
    navigationHelpButton: false,
  };

  return (
    <>
      <Viewer {...props}>
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
            <IconButton onClick={()=>(console.log('route to menu'))}>
              <MenuIcon className="text-white" />
            </IconButton>
            <IconButton  onClick={() => router.push("/countries")}>
              <ArrowBackIcon className="text-white" />
            </IconButton>
            <h1 className="text-white">World map</h1>
            {/* needs a custom-made component to handle BC dates and more */}
            <DatePicker
              defaultValue={dayjs(showDate)}
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
        ))}
      </Viewer>
    </>
  );
}
