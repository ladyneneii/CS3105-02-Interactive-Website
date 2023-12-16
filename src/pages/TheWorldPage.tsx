import { useState, useEffect, useRef } from "react";
import Card from "../components/Card";
import Navbar from "../components/Navbar";
import "leaflet/dist/leaflet.css"; // Import Leaflet CSS
import L from "leaflet";
import Button from "../components/Button";

export interface PositionProps {
  coords: { latitude: number; longitude: number };
  timestamp: number;
}

interface LocationProps {
  location_id: number;
  user_id: number;
  Latitude: number;
  Longitude: number;
  Address: string;
}

const TheWorldPage = () => {
  const mapRef = useRef<L.Map | null>(null); // Create a ref for the map
  const [navbarHeight, setNavbarHeight] = useState(0);
  const [firstTime, setFirstTime] = useState(true);

  const handleNavbarHeightChange = (height: number) => {
    setNavbarHeight(height);
  };

  useEffect(() => {
    mapRef.current = L.map("nearYouMap").setView([0, 0], 2);
    const attribution =
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
    const tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
    const tiles = L.tileLayer(tileUrl, { attribution });
    tiles.addTo(mapRef.current);
    const marker = L.marker([0, 0]).addTo(mapRef.current);

    const getPosition = async (position: PositionProps) => {
      const latitude = position.coords.latitude || 0;
      const longitude = position.coords.longitude || 0;

      if (firstTime) {
        mapRef.current?.setView([latitude, longitude], 19);
        setFirstTime(false);
      }

      // user's location
      marker.setLatLng([latitude, longitude]);

      // get all locations from the database
      try {
        const response = await fetch("http://localhost:3001/api/locations");

        if (response.ok) {
          const locations_json = await response.json();
          console.log(locations_json);

          locations_json.forEach((location: LocationProps) => {
            const { Latitude, Longitude } = location;

            if (mapRef.current) {
              const otherMarker = L.marker([0, 0]).addTo(mapRef.current);

              otherMarker.setLatLng([Latitude, Longitude]);
            }
          });
        } else {
          console.error("Failed to retrieve all locations");
        }
      } catch (error) {
        console.error("Error during GET request:", error);
      }
    };

    const locationError = (err: GeolocationPositionError) => {
      console.error(`Geolocation error (${err.code}): ${err.message}`);
    };

    // Ask for location
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(getPosition);
    } else {
      console.log("geolocation not available");
    }

    // Cleanup function to remove the map when the component unmounts
    return () => {
      mapRef.current?.remove();
    };
  }, []); // Empty dependency array to run once on mount

  return (
    <>
      <Navbar handleNavbarHeightChange={handleNavbarHeightChange}></Navbar>

      <div
        id="nearYouMap"
        style={{ height: `calc(100vh - ${navbarHeight}px)` }}
      ></div>
    </>
  );
};

export default TheWorldPage;
