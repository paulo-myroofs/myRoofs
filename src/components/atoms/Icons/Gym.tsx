import React from "react";

const Gym = ({ color = "#00DC52" }: { color?: string }) => {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="fitness_center">
        <path
          id="fitness_center_2"
          d="M13.697 24L12 22.303L16.303 18L6 7.69697L1.69697 12L0 10.303L1.69697 8.54545L0 6.84848L2.54545 4.30303L0.848485 2.54545L2.54545 0.848485L4.30303 2.54545L6.84848 0L8.54545 1.69697L10.303 0L12 1.69697L7.69697 6L18 16.303L22.303 12L24 13.697L22.303 15.4545L24 17.1515L21.4545 19.697L23.1515 21.4545L21.4545 23.1515L19.697 21.4545L17.1515 24L15.4545 22.303L13.697 24Z"
          fill={color}
        />
      </g>
    </svg>
  );
};

export default Gym;
