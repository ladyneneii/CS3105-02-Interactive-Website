import { useState, useEffect } from "react";
import "../styles/components/card.css";
import jiafei from "../assets/img/jiafei-498x486.webp";
import { Skeleton } from "@mui/material";

interface Props {
  load: number;
}

const Card = ({ load }: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const [imgWidth, setImgWidth] = useState(286);
  const [imgHeight, setImgHeight] = useState(279);

  const [titleWidth, setTitleWidth] = useState(254);
  const [titleHeight, setTitleHeight] = useState(24);

  const [textWidth, setTextWidth] = useState(254);
  const [textHeight, setTextHeight] = useState(72);

  useEffect(() => {
    const img = document.querySelector<HTMLImageElement>(".card-img-top");
    const title = document.querySelector<HTMLHeadingElement>(".card-title");
    const text = document.querySelector<HTMLHeadingElement>(".card-text");

    if (img) {
      setImgWidth(img.getBoundingClientRect().width);
      setImgHeight(img.getBoundingClientRect().height);
    }

    if (title) {
      setTitleWidth(title.getBoundingClientRect().width);
      setTitleHeight(title.getBoundingClientRect().height);
    }

    if (text) {
      setTextWidth(text.getBoundingClientRect().width);
      setTextHeight(text.getBoundingClientRect().height);
    }

    setTimeout(() => {
      setIsLoading(true);
    }, load);

    console.log(textWidth, textHeight);
  }, [load]);

  return (
    <>
      <div className="card card__width">
        {isLoading ? (
          <img src={jiafei} className="card-img-top" alt="our kween jiafei" />
        ) : (
          <Skeleton
            variant="rounded"
            animation="wave"
            width={imgWidth}
            height={imgHeight}
          />
        )}
        <div className="card-body">
          {isLoading ? (
            <h5 className="card-title">Card title</h5>
          ) : (
            <Skeleton
              variant="rounded"
              animation="wave"
              width={titleWidth}
              height={titleHeight}
              style={{
                marginBottom: 8,
              }}
            />
          )}
          {isLoading ? (
            <p className="card-text">
              Some quick example text to build on the card title and make up the
              bulk of the card's content.
            </p>
          ) : (
            <Skeleton
              variant="rounded"
              animation="wave"
              width={textWidth}
              height={textHeight}
              style={{
                marginBottom: 16,
              }}
            />
          )}
          <a href="#" className="btn btn-primary">
            Go somewhere
          </a>
        </div>
      </div>
    </>
  );
};

export default Card;
