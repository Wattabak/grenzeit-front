
type oneToNine = 1|2|3|4|5|6|7|8|9;
type d = 1|2|3|4|5|6|7|8|9|0;

type YYYY = `19${d}${d}` | `20${d}${d}`;
type MM = `0${oneToNine}` | `1${0|1|2}`;

export type DateString = `${YYYY}-${MM}`;

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
  founded_at: DateString | string;
  dissolved_at?: DateString | string;
  name_zeit: string;
  name_eng: string;
  cluster?: string;
  territory: {
    date_start: DateString | string;
    date_end: DateString | string | null;
    geometry: Geometry;
  };
};

export type Territory = {
  uid: string;
  date_start: DateString | string;
  date_end: DateString | string | null;
  geometry: Geometry;
};

export type FullCountry = {
  uid: string;
  founded_at: DateString | string;
  dissolved_at?: DateString | string;
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
export type SchemaObject = {
  format: string | undefined
  type: "date" | "date-time" | "array" | "string" | undefined
}

export type SchemaType = {
  anyOf: SchemaObject[] | undefined;
  format: string | undefined;
  type: string | undefined;
  description: string | undefined;
};
export enum EditorState {
  Edit = "Edit",
  View = "View",
  New = "New",
}
export type ModelSchema = {
  properties: {
    [key: string]: SchemaType;
  };
  required: string[];
};
