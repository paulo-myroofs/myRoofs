import React from "react";

const Cake = ({ color = "#00DC52" }: { color?: string }) => {
  return (
    <svg
      width="24"
      height="26"
      viewBox="0 0 24 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="cake">
        <path
          id="cake_2"
          d="M1.33333 26C0.955556 26 0.638889 25.8754 0.383333 25.6262C0.127778 25.3771 0 25.0683 0 24.7V18.2C0 17.485 0.261111 16.8729 0.783333 16.3638C1.30556 15.8546 1.93333 15.6 2.66667 15.6V10.4C2.66667 9.685 2.92778 9.07292 3.45 8.56375C3.97222 8.05458 4.6 7.8 5.33333 7.8H10.6667V5.915C10.2667 5.655 9.94444 5.34083 9.7 4.9725C9.45556 4.60417 9.33333 4.16 9.33333 3.64C9.33333 3.315 9.4 2.99542 9.53333 2.68125C9.66667 2.36708 9.86667 2.08 10.1333 1.82L12 0L13.8667 1.82C14.1333 2.08 14.3333 2.36708 14.4667 2.68125C14.6 2.99542 14.6667 3.315 14.6667 3.64C14.6667 4.16 14.5444 4.60417 14.3 4.9725C14.0556 5.34083 13.7333 5.655 13.3333 5.915V7.8H18.6667C19.4 7.8 20.0278 8.05458 20.55 8.56375C21.0722 9.07292 21.3333 9.685 21.3333 10.4V15.6C22.0667 15.6 22.6944 15.8546 23.2167 16.3638C23.7389 16.8729 24 17.485 24 18.2V24.7C24 25.0683 23.8722 25.3771 23.6167 25.6262C23.3611 25.8754 23.0444 26 22.6667 26H1.33333ZM5.33333 15.6H18.6667V10.4H5.33333V15.6ZM2.66667 23.4H21.3333V18.2H2.66667V23.4Z"
          fill={color}
        />
      </g>
    </svg>
  );
};

export default Cake;
