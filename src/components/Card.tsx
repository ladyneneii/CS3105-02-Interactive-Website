import empty_pfp from "../assets/img/empty-profile-picture-612x612.jpg";
import { Link } from "react-router-dom";

interface CardComponentProps {
  Username: string;
  firebase_avatar_url: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  DistanceAway: { metersAway: number; kilometersAway: number };
  disorders_specializations: string;
}

const Card = ({
  Username,
  firebase_avatar_url,
  first_name,
  middle_name,
  last_name,
  DistanceAway,
  disorders_specializations,
}: CardComponentProps) => {
  return (
    <div className="card mb-5" style={{ width: "18rem" }}>
      <Link
        to={`/ProfilePage/${Username}`}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <img
          src={firebase_avatar_url === "n/a" ? empty_pfp : firebase_avatar_url}
          className="card-img-top"
          alt="..."
          style={{ width: "100%", height: "300px", objectFit: "cover" }}
        />
        <div className="card-body">
          <h5 className="card-title">
            {first_name} {middle_name === "n/a" ? "" : middle_name} {last_name}{" "}
            <span className="text-body-tertiary">({Username})</span>
          </h5>

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
