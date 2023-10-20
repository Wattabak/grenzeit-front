"use client";

import React, { useState, useEffect, useRef } from "react";
import { Cluster } from "@/utils/types";
import useSWR from "swr";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { GeoJsonDataSource, Viewer } from "resium";
import { Color } from "cesium";

interface ClusterListResponse {
  clusters: Cluster[];
}

const fetcher = (...args: any) =>
  fetch(...args)
    .then((res) => res.json())
    .catch((e) => console.error(e));

function useClusters() {
  const { data, error, isLoading } = useSWR<ClusterListResponse, Error>(
    `/api/grenzeit/geometries/clusters/`,
    fetcher
  );

  return {
    clusters: data,
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
  const { clusters, error, isLoading } = useClusters();

  // const [rowCountState, setRowCountState] = useState(clusters.clusters.length || 0);
  const viewerRef = useRef();

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
            padding: "15px",
          }}
        >
          <h1 className="text-white text-3xl">Cluster map</h1>
        </div>
        {clusters?.clusters?.map((cluster) => (
          <GeoJsonDataSource
            key={cluster.uid}
            name={cluster.name}
            data={cluster.geometry ? cluster.geometry : null}
            strokeWidth={0.9}
            stroke={Color.WHITE}
            fill={Color.fromRandom()}
            onLoad={(g) => {
              g.entities.values.map((e) => {
                e.name = cluster.name;
              });
            }}
          />
        ))}
      </Viewer>
    </>
  );
}