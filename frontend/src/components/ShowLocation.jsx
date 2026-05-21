import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";

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
    googleMapsApiKey: "YOUR_API_KEY_HERE",
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