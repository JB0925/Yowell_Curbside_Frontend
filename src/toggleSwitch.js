import React from "react";
import "./toggleSwitch.css";

export default function ToggleSwitch({ checkState }) {
  const { isChecked, setIsChecked } = checkState;
  const changeBackground = () => {
    if (!isChecked) {
      document.body.style.backgroundColor = "white";
      document.body.style.color = "#0c162e";
    } else {
      document.body.style.backgroundColor = "#0c162e";
      document.body.style.color = "white";
    }
    setIsChecked(!isChecked);
  };

  return (
    <div className="ToggleSwitch">
      <label className="switch" htmlFor="slider">
        <input
          data-testid="toggle"
          type="checkbox"
          id="slider"
          onClick={changeBackground}
        />
        <div className="round"></div>
      </label>
    </div>
  );
}
