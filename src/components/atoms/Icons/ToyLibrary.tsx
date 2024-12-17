import React from "react";

const ToyLibrary = ({ color = "#00DC52" }: { color?: string }) => {
  return (
    <svg
      width="72"
      height="72"
      viewBox="0 0 100 94"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M30.1351 59.3262C43 69.2009 55.8649 69.2009 68.7297 59.3262"
        stroke={color}
        stroke-width="4"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M65.3243 61.4421L60.7838 43.4559L63.0541 39.2239L67.5946 41.3399L71 38.1659L65.3243 28.6438C53.8549 29.1051 51.7254 35.2733 49.4324 41.3399H35.8108C34.0045 41.3399 32.2721 42.0087 30.9948 43.1992C29.7176 44.3897 29 46.0044 29 47.688M33.5405 61.4421L38.0811 41.3399"
        stroke={color}
        stroke-width="4"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M40.3513 64.6162L44.8919 54.0361H53.9729L58.5135 64.6162"
        stroke={color}
        stroke-width="4"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default ToyLibrary;
