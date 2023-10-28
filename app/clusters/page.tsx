"use client";

import React, { useRef } from "react";
import { Cluster } from "@/utils/types";
import useSWR from "swr";
import { CesiumComponentRef, GeoJsonDataSource, ImageryLayer, Viewer } from "resium";
import { Color, IonImageryProvider } from "cesium";
import { singleFetcher } from "@/utils/fetchers";
import { Viewer as CViewer } from "cesium";

interface ClusterListResponse {
  clusters: Cluster[];
}

function useClusters(): ClusterListResponse {
  const { data, error } = useSWR<ClusterListResponse>(
    `/api/grenzeit/geometries/clusters/`,
    singleFetcher
  );

  if (!data) {
    return { clusters: [] } as ClusterListResponse;
  }

  return data;
}

interface ClusterListProps {
  params: {
    countryId: string;
  };
}

export default function Page({ params }: ClusterListProps) {
  const clusters = useClusters();

  const viewerRef = useRef<null | CesiumComponentRef<CViewer>>(null);
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
  const imageryProvider = IonImageryProvider.fromAssetId(3954, {});

  return (
    <>
      <Viewer {...viewerProps}>
      <ImageryLayer alpha={1} imageryProvider={imageryProvider} />

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
