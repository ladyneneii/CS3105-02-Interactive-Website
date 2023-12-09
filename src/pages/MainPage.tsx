import { useState, useEffect, useRef } from "react";
import Card from "../components/Card";
import Navbar from "../components/Navbar";
import "leaflet/dist/leaflet.css"; // Import Leaflet CSS
import L from "leaflet";

interface PositionProps {
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

const MainPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const mapRef = useRef<L.Map | null>(null); // Create a ref for the map

  useEffect(() => {
    const initializeMap = () => {
      if (!mapRef.current) {
        mapRef.current = L.map("nearYouMap").setView([0, 0], 1); // Use the ref
        const attribution =
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
        const tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
        const tiles = L.tileLayer(tileUrl, { attribution });
        tiles.addTo(mapRef.current); // Use the ref

        const marker = L.marker([0, 0]).addTo(mapRef.current); // Use the ref

        let firstTime = true;

        const getPosition = async (position: PositionProps) => {
          // Get coordinates
          const latitude = position.coords.latitude || 0;
          const longitude = position.coords.longitude || 0;

          if (firstTime) {
            mapRef.current?.setView([latitude, longitude], 19); // Use the ref
            firstTime = false;
          }

          // user's location
          marker.setLatLng([latitude, longitude]);

          const unparsed_user_details = localStorage.getItem("user_details");

          if (unparsed_user_details) {
            // only add location to database if user is an mhp
            if (JSON.parse(unparsed_user_details)?.Role === "mhp") {
              const user_id = JSON.parse(unparsed_user_details)?.user_id;
              // Get mhp_id and location from mhp user
              try {
                const response = await fetch(
                  `http://localhost:3001/api/location_check/${user_id}`
                );

                if (response.ok) {
                  const { user_id, location_id } = await response.json();
                  const formData = new FormData();

                  formData.append("user_id", user_id);
                  formData.append("location_id", location_id);
                  formData.append("Latitude", latitude.toString());
                  formData.append("Longitude", longitude.toString());
                  formData.append("Address", "n/a");

                  // add location to database
                  try {
                    // Make a PUT request to server endpoint
                    const response = await fetch(
                      "http://localhost:3001/api/locations",
                      {
                        method: "PUT",
                        body: formData,
                      }
                    );

                    if (response.ok) {
                      console.log("Successfully added/updated location.");
                    } else {
                      console.error(
                        "Failed to add/update location to the database"
                      );
                    }
                  } catch (error) {
                    console.error("Error during POST request:", error);
                  }
                } else {
                  console.error("Something is wrong.");

                  return;
                }
              } catch (error) {
                console.error("Error during GET request:", error);

                return;
              }
            }

            // get all locations from the database
            try {
              const response = await fetch(
                "http://localhost:3001/api/locations"
              );

              if (response.ok) {
                const locations_json = await response.json();
                console.log(locations_json);

                locations_json.forEach((location: LocationProps) => {
                  const { Latitude, Longitude } = location;

                  if (mapRef.current) {
                    const otherMarker = L.marker([0, 0]).addTo(mapRef.current); // Use the ref

                    otherMarker.setLatLng([Latitude, Longitude]);
                  }
                });
              } else {
                console.error("Failed to retrieve all locations");
              }
            } catch (error) {
              console.error("Error during GET request:", error);
            }
          } else {
            console.log("No user_details retrieved.");
          }
        };

        const locationError = (err: GeolocationPositionError) => {
          console.error(`Geolocation error (${err.code}): ${err.message}`);
        };

        // Ask for location
        if ("geolocation" in navigator) {
          navigator.geolocation.watchPosition(getPosition, locationError, {
            enableHighAccuracy: true,
          });
        } else {
          console.log("geolocation not available");
        }

        // Cleanup function to remove the map when the component unmounts
        return () => {
          mapRef.current?.remove(); // Use the ref
        };
      }
    };

    initializeMap(); // Call the initialization function directly
  }, []); // Empty dependency array to run once on mount

  return (
    <>
      <Navbar></Navbar>

      <div id="nearYouMap" style={{ height: "480px" }}></div>
    </>
  );
};

export default MainPage;
