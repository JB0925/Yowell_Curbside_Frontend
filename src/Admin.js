import React from "react";
import curbsideAPI from "./curbsideAPI";
import UseRedirectToHttps from "./HttpsRedirect";

export default function Admin() {
  UseRedirectToHttps();

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
