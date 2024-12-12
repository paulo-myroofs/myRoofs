import React from "react";

const Gourmet = ({ color = "#00DC52" }: { color?: string }) => {
  return (
    <svg
      width="100"
      height="94"
      viewBox="0 0 100 94"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M68 55.0155V23.6821C55.616 35.6776 55.0837 45.404 55.1429 55.0155H68ZM68 55.0155V70.6821H65.4286V62.8488M39.7143 26.2932V70.6821M32 26.2932V34.1266C32 36.2041 32.8128 38.1965 34.2595 39.6656C35.7062 41.1346 37.6683 41.9599 39.7143 41.9599C41.7602 41.9599 43.7224 41.1346 45.1691 39.6656C46.6158 38.1965 47.4286 36.2041 47.4286 34.1266V26.2932"
        stroke="#00DC52"
        stroke-width="5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default Gourmet;
