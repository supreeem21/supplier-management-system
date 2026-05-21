import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const containerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 27.7172,
  lng: 85.3240,
};

export default function MyMap() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: apiKey,
  });

  if (!isLoaded) return <p>Loading map...</p>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={12}
    >
      <Marker position={center}/>
    </GoogleMap>
  );
}