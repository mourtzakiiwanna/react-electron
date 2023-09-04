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
      stroke="red"
      width="20"
      height="20"
      className={className}
      style={customStyles}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}
