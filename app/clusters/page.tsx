"use client";

import React, { useState, useEffect } from "react";
import { Cluster } from "@/utils/types";
import useSWR from "swr";
import CountriesGrid from "@/components/CountriesGrid";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { Entity, GeoJsonDataSource, Viewer } from "resium";
import { Color } from "cesium";

interface ClusterListResponse {
  clusters: Cluster[];
}

const fetcher = (...args: any) => fetch(...args).then((res) => res.json());

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

  const router = useRouter();

  if (error) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data on countries");
  }

  if (isLoading) return <div>Loading ...</div>;

  return (
    <>
      <h1 className="text-3xl font-bold">Clusters</h1>
      <Viewer>
        {clusters?.clusters?.map((cluster) => (
          <GeoJsonDataSource
            key={cluster.uid}
            name={cluster.name}
            data={cluster.geometry ? cluster.geometry : null}
            strokeWidth={0.9}
            stroke={Color.WHITE}
            fill={Color.fromRandom()}
          />
        ))}
      </Viewer>
    </>
  );
}
