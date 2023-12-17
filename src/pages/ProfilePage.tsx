import React, { useState, useEffect } from "react";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import empty_pfp from "../assets/img/empty-profile-picture-612x612.jpg";
import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";

interface MHPFullInfoProps {
  Username: string;
  avatar_url: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  Age: number;
  Gender: string;
  Pronouns: string;
  Role: string;
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

const ProfilePage = () => {
  const { user } = useParams<{ user?: string }>();
  const [userDetails, setUserDetails] = useState<MHPFullInfoProps | null>(null);

  let username = "";
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    if (!user) {
      const user_details_str = localStorage.getItem("user_details");

      if (user_details_str) {
        username = JSON.parse(user_details_str).Username;
      } else {
        console.error("user details not found in the local storage.");
      }
    } else {
      username = user;
    }

    const storage = getStorage();
    const avatarRef = ref(storage, username);

    getDownloadURL(avatarRef)
      .then((url) => {
        setAvatarUrl(url);
      })
      .catch((error) => {
        switch (error.code) {
          case "storage/object-not-found":
            // File doesn't exist
            break;
          case "storage/unauthorized":
            // User doesn't have permission to access the object
            break;
          case "storage/canceled":
            // User canceled the upload
            break;
          case "storage/unknown":
            // Unknown error occurred, inspect the server response
            break;
        }
      });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          const fetchUserDetails = async () => {
            try {
              const response = await fetch(
                `http://localhost:3001/api/mhp_nhp_with_user_info/${username},${latitude},${longitude}`
              );

              if (response.ok) {
                const user_details_json = await response.json();
                console.log(user_details_json);
                setUserDetails(user_details_json);
              } else {
                console.error("Failed to retrieve user");
              }
            } catch (error) {
              console.error("Error during GET request:", error);
            }
          };

          fetchUserDetails();
        },
        (error) => {
          // Error handling, including permission denial
          console.error(`Error getting geolocation: ${error.message}`);
        }
      );
    } else {
      console.error("Geolocation is not supported by your browser");
    }
  }, []);

  return (
    <>
      <Navbar />
      <div className="container mt-3">
        {userDetails ? (
          // Destructure userDetails outside JSX
          (() => {
            const {
              first_name,
              middle_name,
              last_name,
              Username,
              Role,
              Age,
              Gender,
              Pronouns,
              DistanceAway,
              disorders_specializations,
              years_of_experience,
              Languages,
              available_days,
              available_hours,
              Fees,
              Address,
              Notes,
            } = userDetails;

            let disorders_specializations_arr: string[] = [];
            if (disorders_specializations) {
              const modifiedString: string = disorders_specializations.replace(
                /-|(and)|(\b\w)/g,
                (match, and, letter) =>
                  and ? "and" : letter ? letter.toUpperCase() : " "
              );
              disorders_specializations_arr = modifiedString.split(", ");
            }

            let availableDays = "";
            if (available_days) {
              availableDays = available_days
                .split(", ")
                .map((day) => day.charAt(0).toUpperCase() + day.slice(1))
                .join(", ");
            }

            let feesWithPeso = "";
            if (Fees) {
              feesWithPeso = Fees.includes("-above")
                ? Fees.replace("-above", "+")
                : Fees;

              feesWithPeso = feesWithPeso
                .split(", ")
                .map((range) =>
                  range
                    .split("-")
                    .map((amount) => `₱${amount}`)
                    .join("-")
                )
                .join(", ");
            }

            console.log(feesWithPeso);

            console.log(feesWithPeso);

            return (
              <div className="row">
                <div className="col">
                  <img
                    src={avatarUrl || empty_pfp}
                    alt="User avatar"
                    className="border rounded-circle"
                    style={{
                      width: "300px",
                      height: "300px",
                      objectFit: "cover",
                    }}
                  />
                  <h2 className="mt-4">
                    {first_name} {middle_name === "n/a" ? "" : middle_name}{" "}
                    {last_name}{" "}
                    <span className="text-body-tertiary">({Username})</span>
                  </h2>
                  <h4>
                    {Role === "mhp"
                      ? "Mental Health Professional"
                      : Role === "nmhp"
                      ? "Not a Mental Health Professional"
                      : "Admin"}
                  </h4>
                  <h4>{Age}</h4>
                  <h4>{Gender === "PNTS" ? "" : Gender}</h4>
                  <h4>{Pronouns === "n/a" ? "" : Pronouns}</h4>
                  {DistanceAway && (
                    <h6 className="text-secondary">
                      {DistanceAway.metersAway} m away /{" "}
                      {DistanceAway.kilometersAway} km away from you.
                    </h6>
                  )}
                </div>
                <div className="col">
                  {Role === "mhp" && (
                    <>
                      <div className="mt-2">
                        <h4>Disorders Specializations:</h4>
                        <div className="d-flex flex-column align-items-start">
                          {disorders_specializations_arr.map(
                            (disorders_specialization, index) => (
                              <p key={index} className="my-0 ms-4">
                                {disorders_specialization}
                              </p>
                            )
                          )}
                        </div>
                      </div>
                      <div className="mt-2">
                        <h4>Years of Experience:</h4>
                        <p className="my-0 ms-4">{years_of_experience} years</p>
                      </div>
                      <div className="mt-2">
                        <h4>Spoken Languages:</h4>
                        <p className="my-0 ms-4">{Languages}</p>
                      </div>
                      <div className="mt-2">
                        <h4>Available Days:</h4>
                        <p className="my-0 ms-4">{availableDays}</p>
                      </div>
                      <div className="mt-2">
                        <h4>Available Hours:</h4>
                        <p className="my-0 ms-4">{available_hours}</p>
                      </div>
                      <div className="mt-2">
                        <h4>Fees:</h4>
                        <p className="my-0 ms-4">{feesWithPeso}</p>
                      </div>
                      <div className="mt-2">
                        <h4>Address:</h4>
                        <p className="my-0 ms-4">
                          {Address === "n/a" ? "Not indicated." : Address}
                        </p>
                      </div>
                      <div className="mt-2">
                        <h4>Notes:</h4>
                        <p className="my-0 ms-4">{Notes}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })()
        ) : (
          <p>User info not found</p>
        )}
      </div>
    </>
  );
};

export default ProfilePage;
