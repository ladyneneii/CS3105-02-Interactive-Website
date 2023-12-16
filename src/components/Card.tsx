import React from "react";
import empty_pfp from "../assets/img/empty-profile-picture-612x612.jpg";
import jiafei from "../assets/img/jiafei-498x486.webp";

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

  return (
    <div className="card mb-5" style={{ width: "18rem" }}>
      <img src={jiafei} className="card-img-top" alt="..." />
      <div className="card-body">
        <h5 className="card-title">
          {first_name} {middle_name === "n/a" ? "" : middle_name} {last_name}
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

        <p className="card-text my-0">{DistanceAway.metersAway} m away</p>
        <p className="card-text my-0">{DistanceAway.kilometersAway} km away</p>
      </div>
    </div>
  );
};

export default Card;
