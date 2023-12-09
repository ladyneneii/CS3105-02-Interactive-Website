import React, { useEffect, useState } from "react";

interface LocationProps {
  coords: {
    latitude: number;
    longitude: number;
  };
}

interface CustomError extends GeolocationPositionError {
  code: number;
  message: string;
  PERMISSION_DENIED: 1;
  POSITION_UNAVAILABLE: 2;
  TIMEOUT: 3;
}

const useGeoLocation = () => {
  const [location, setLocation] = useState({
    loaded: false,
    coordinates: { lat: "", lng: "" },
    error: null as CustomError | null,
  });

  const onSuccess = (location: LocationProps) => {
    setLocation({
      loaded: true,
      coordinates: {
        lat: location.coords.latitude.toString(),
        lng: location.coords.longitude.toString(),
      },
      error: null,
    });
  };

  const onError = (error: GeolocationPositionError | null) => {
    setLocation({
      loaded: true,
      coordinates: { lat: "", lng: "" },
      error: {
        code: error?.code || 0,
        message: error?.message || "Geolocation error",
        PERMISSION_DENIED: error?.PERMISSION_DENIED || 1,
        POSITION_UNAVAILABLE: error?.POSITION_UNAVAILABLE || 2,
        TIMEOUT: error?.TIMEOUT || 3,
      },
    });
  };

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      console.error("Geolocation not supported.");
    }

    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  }, []);

  return location;
};

export default useGeoLocation;
