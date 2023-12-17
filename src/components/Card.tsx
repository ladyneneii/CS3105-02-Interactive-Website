import React, { useEffect, useState } from "react";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import empty_pfp from "../assets/img/empty-profile-picture-612x612.jpg";
import jiafei from "../assets/img/jiafei-498x486.webp";
import { Link } from "react-router-dom";

interface CardComponentProps {
  Username: string;
  avatar_url: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  DistanceAway: { metersAway: number; kilometersAway: number };
  disorders_specializations: string;
}

const Card = ({
  Username,
  avatar_url,
  first_name,
  middle_name,
  last_name,
  DistanceAway,
  disorders_specializations,
}: CardComponentProps) => {
  const modifiedString: string = disorders_specializations.replace(
    /-|(and)|(\b\w)/g,
    (match, and, letter) => (and ? "and" : letter ? letter.toUpperCase() : " ")
  );
  const disorders_specializations_arr: string[] = modifiedString.split(", ");

  const [avatarUrl, setAvatarUrl] = useState("")

  useEffect(() => {
    // Create a reference to the file we want to download
    const storage = getStorage();
    const avatarRef = ref(storage, Username);

    // Get the download URL
    getDownloadURL(avatarRef)
      .then((url) => {
        setAvatarUrl(url)
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
  }, []);

  return (
    <div className="card mb-5" style={{ width: "18rem" }}>
      <Link
        to={`/ProfilePage/${Username}`}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <img
          src={avatarUrl || empty_pfp}
          className="card-img-top"
          alt="..."
          style={{ width: "100%", height: "300px", objectFit: "cover" }}
        />
        <div className="card-body">
          <h5 className="card-title">
            {first_name} {middle_name === "n/a" ? "" : middle_name} {last_name}{" "}
            <span className="text-body-tertiary">({Username})</span>
          </h5>

          {/* <div className="d-flex flex-column align-items-start">
              {disorders_specializations_arr.map(
                (disorders_specialization, index) => (
                  <p key={index} className="card-text my-0">
                    {disorders_specialization}
                  </p>
                )
              )}
            </div> */}

          <p className="card-text my-0">
            {DistanceAway ? DistanceAway.metersAway : "n/a"} m away
          </p>
          <p className="card-text my-0">
            {DistanceAway ? DistanceAway.kilometersAway : "n/a"} km away
          </p>
        </div>
      </Link>
    </div>
  );
};

export default Card;
