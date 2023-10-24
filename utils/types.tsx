type Geometry = {
  type:
    | "Point"
    | "MultiPoint"
    | "LineString"
    | "MultiLineString"
    | "Polygon"
    | "MultiPolygon"
    | "GeometryCollection";
  coordinates: number[] | number[][] | number[][][] | number[][][][];
};

export type Country = {
  uid: string;
  founded_at: Date;
  dissolved_at?: Date;
  name_zeit: string;
  name_eng: string;
  cluster?: string;
  territory: {
    date_start: Date;
    date_end: Date;
    geometry: Geometry;
  };
};

export type Territory = {
  uid: string;
  date_start: Date;
  date_end: Date;
  geometry: Geometry;
};

export type FullCountry = {
  uid: string;
  founded_at: Date;
  dissolved_at?: Date;
  name_zeit: string;
  name_eng: string;
  cluster?: string;
  territories: Territory[];
};

export type Cluster = {
  uid: string;
  name: string;
  boundary: object;
  geometry: object;
};

export interface PaginatedResponse {
  items: Object[];
  total: number;
  page: number;
  size: number;
  pages: number;
}
export type SchemaType = {
  anyOf: object[] | undefined;
  format: string | undefined;
  type: string | undefined;
  description: string | undefined;
};
