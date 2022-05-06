import React from "react";
import "./toggleSwitch.css";

export default function ToggleSwitch({ checkState }) {
  const { isChecked, setIsChecked } = checkState;
  const changeBackground = () => {
    if (!isChecked) {
      document.documentElement.style = "white";
      document.body.style.backgroundColor = "white";
      document.body.style.color = "#0c162e";
    } else {
      document.documentElement.style = "#0c162e";
      document.body.style.backgroundColor = "#0c162e";
      document.body.style.color = "white";
    }
    console.log(document.documentElement);
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
