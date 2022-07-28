import React from "react";
import curbsideAPI from "./curbsideAPI";

export default function Admin() {
  const handleClick = async () => {
    await curbsideAPI.resetAll();
  };

  return (
    <div>
      <button type="button" onClick={handleClick} style={{ cursor: "pointer" }}>
        Reset
      </button>
    </div>
  );
}
