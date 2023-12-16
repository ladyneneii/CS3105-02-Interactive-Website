import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Alert from "../components/Alert";
import Card from "../components/Card";

interface MHPSummarizedInfoProps {
  Username: string;
  avatar_url: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  Age: number;
  Gender: string;
  Pronouns: string;
  disorders_specializations: string;
  Fees: string;
  years_of_experience: number;
  Languages: string;
  min_age: number;
  max_age: string;
  Notes: string;
  available_days: string;
  available_hours: string;
  Address: string;
  Latitude: string;
  Longitude: string;
  DistanceAway: { metersAway: number; kilometersAway: number };
}

const MainPage = () => {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [allMhps, setAllMhps] = useState<MHPSummarizedInfoProps[]>([]);
  useEffect(() => {
    const fetchAllMHPs = async () => {
      try {
        const response = await fetch(
          "http://localhost:3001/api/mhps_with_user_info"
        );

        if (response.ok) {
          const mhps_json = await response.json();
          console.log(mhps_json);
          setAllMhps(mhps_json);
        } else {
          console.error("Failed to retrieve all mhps");
        }
      } catch (error) {
        console.error("Error during GET request:", error);
      }
    };

    const fetchAllMHPsOrdered = async (lat: number, lon: number) => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/mhps_with_user_info_ordered/${lat},${lon}`
        );

        if (response.ok) {
          const mhps_json = await response.json();
          console.log("Here are the ordered mhps:");
          console.log(mhps_json);
          setAllMhps(mhps_json);
        } else {
          console.error("Failed to retrieve all ordered mhps");
        }
      } catch (error) {
        console.error("Error during GET request:", error);
      }
    };

    const putLocation = async (latitude: number, longitude: number) => {
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
      } else {
        console.log("No user_details retrieved.");
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          setError(null);
          console.log(`This is the location: ${latitude} ${longitude}`);
          putLocation(latitude, longitude);
          fetchAllMHPsOrdered(latitude, longitude);
        },
        (error) => {
          // Error handling, including permission denial
          setError(`Error getting geolocation: ${error.message}`);
          fetchAllMHPs();
        }
      );
    } else {
      setError("Geolocation is not supported by your browser");
    }
  }, []);

  return (
    <>
      <Navbar></Navbar>
      {error && <Alert color="danger">{error}</Alert>}
      <div className="container text-center mt-2">
        <h1 className="text-center mb-4">
          Mental Health Professionals Near Me
        </h1>
        <div className="row">
          {allMhps.map(
            ({
              Username,
              avatar_url,
              first_name,
              middle_name,
              last_name,
              DistanceAway,
              disorders_specializations,
            }) => (
              <div key={Username} className="col">
                <Card
                  Username={Username}
                  avatar_url={avatar_url}
                  first_name={first_name}
                  middle_name={middle_name}
                  last_name={last_name}
                  DistanceAway={DistanceAway}
                  disorders_specializations={disorders_specializations}
                ></Card>
              </div>
            )
          )}
        </div>
      </div>
    </>
  );
};

export default MainPage;
