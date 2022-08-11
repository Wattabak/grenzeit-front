import { Viewer, Entity, GeoJsonDataSource } from 'resium'
import * as Ces from 'cesium' ;

export default function Cesium() {
    Ces.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiNTcyMWYwMi0yZGQ5LTRmODYtYjhmOS1mYTMzNWIxZGU2ZWEiLCJpZCI6MTAwNTk0LCJpYXQiOjE2NTczMjAzODZ9._CN9Nveo0jvNiWgNDR-B3NKhUWEmbXZS1IQHt_qciCM';

    return (
        <Viewer full>
            {/* <GeoJsonDataSource 
    data={process.env.PUBLIC_URL + "world.geojson"} 
    show={true}
    stroke={"#fff"}
    strokeWidth={5.0}
    fill={Cesium.Color.fromAlpha(Cesium.Color.RED, 0.44)}
    /> */}
            <GeoJsonDataSource
                data={"/static/Russian_Empire_1897_-_Districts.geojson"}
                show={true}
                stroke={"#fff"}
                strokeWidth={5.0}
                fill={Ces.Color.fromAlpha(Ces.Color.RED, 0.44)}
            />

        </Viewer>
    )
}