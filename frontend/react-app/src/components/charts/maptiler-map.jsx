import Map from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";

export default function MyMap() {
  const MAPTILER_KEY = "SydL1767et7Z6a21E32p"; // free from maptiler.com

  return (
    <Map
      mapLib={import("maplibre-gl")}
      initialViewState={{
        longitude: 77.59369, // Bengaluru
        latitude: 12.97194,
        zoom: 9,
      }}
      style={{ width: "100%", height: "650px" }}
      mapStyle={`https://api.maptiler.com/maps/01993cdd-e0d0-700c-960c-3d19ba4970e0/style.json?key=${MAPTILER_KEY}#`}
    />
  );
}
