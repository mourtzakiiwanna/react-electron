import React from "react";

export default function (props) {
  const {
    className,
    customStyles = {
      cursor: "pointer",
      padding: "0 0.2rem"
    }
  } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="green"
      width="20"
      height="20"
      className={className}
      style={customStyles}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}
