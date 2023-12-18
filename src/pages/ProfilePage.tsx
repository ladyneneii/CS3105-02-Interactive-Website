import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import empty_pfp from "../assets/img/empty-profile-picture-612x612.jpg";
import Navbar from "../components/Navbar";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../components/Button";

const socket = io("http://localhost:3001");

interface MHPFullInfoProps {
  user_id: string;
  Username: string;
  firebase_avatar_url: string;
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
  const navigate = useNavigate();
  const { user } = useParams<{ user?: string }>();
  const [userDetails, setUserDetails] = useState<MHPFullInfoProps | null>(null);
  const [loggedInUserId, setLoggedInUserId] = useState("");
  const [loggedInUsername, setLoggedInUsername] = useState("");

  let username = "";
  let logged_in_user_id = "";
  let logged_in_username = "";
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    const user_details_str = localStorage.getItem("user_details");

    if (user_details_str) {
      logged_in_user_id = JSON.parse(user_details_str).user_id;
      logged_in_username = JSON.parse(user_details_str).Username;
    } else {
      console.error("user details not found in the local storage.");
    }
    username = !user ? logged_in_username : user;

    setLoggedInUserId(logged_in_user_id);
    setLoggedInUsername(logged_in_username);

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

  const handleMessage = async (
    e: React.MouseEvent<HTMLButtonElement>,
    user_id: string,
    Username: string
  ) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("Member1", loggedInUsername);
      formData.append("Member2", Username);
      formData.append("Title", `${loggedInUsername}, ${Username}`);
      formData.append("State", "Active");
      formData.append("member1_user_id", loggedInUserId);
      formData.append("member2_user_id", user_id);

      const response = await fetch("http://localhost:3001/api/private_rooms", {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        const private_room_id = await response.json();
        console.log(private_room_id);

        navigate("/MessagesPage");
      } else {
        console.error(
          "Failed to add private room to the database or fetch private room from the database."
        );
        console.log(response);

        return;
      }
    } catch (error) {
      console.error("Error during PUT request:", error);

      return;
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-3 p-3">
        {userDetails ? (
          // Destructure userDetails outside JSX
          (() => {
            const {
              user_id,
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
              firebase_avatar_url,
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

            return (
              <div className="row">
                <div className="col">
                  <img
                    src={
                      firebase_avatar_url === "n/a"
                        ? empty_pfp
                        : firebase_avatar_url
                    }
                    alt="User avatar"
                    className="border rounded-circle"
                    style={{
                      width: "250px",
                      height: "250px",
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
                  {Username != loggedInUsername && (
                    <Button
                      color="primary"
                      onClick={(e) => handleMessage(e, user_id, Username)}
                    >
                      Message
                    </Button>
                  )}
                </div>
                <div className="col">
                  {Role === "mhp" && (
                    <>
                      <div className="mt-2">
                        <h5>Disorders Specializations:</h5>
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
                        <h5>Years of Experience:</h5>
                        <p className="my-0 ms-4">{years_of_experience} years</p>
                      </div>
                      <div className="mt-2">
                        <h5>Spoken Languages:</h5>
                        <p className="my-0 ms-4">{Languages}</p>
                      </div>
                      <div className="mt-2">
                        <h5>Available Days:</h5>
                        <p className="my-0 ms-4">{availableDays}</p>
                      </div>
                      <div className="mt-2">
                        <h5>Available Hours:</h5>
                        <p className="my-0 ms-4">{available_hours}</p>
                      </div>
                      <div className="mt-2">
                        <h5>Fees:</h5>
                        <p className="my-0 ms-4">{feesWithPeso}</p>
                      </div>
                      <div className="mt-2">
                        <h5>Address:</h5>
                        <p className="my-0 ms-4">
                          {Address === "n/a" ? "Not indicated." : Address}
                        </p>
                      </div>
                      <div className="mt-2">
                        <h5>Notes:</h5>
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
