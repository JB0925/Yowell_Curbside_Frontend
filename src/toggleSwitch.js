import React, { useEffect, useRef } from "react";
import "./toggleSwitch.css";

export default function ToggleSwitch({ checkState }) {
  const { isChecked, setIsChecked } = checkState;
  const checkboxRef = useRef();

  const changeBackground = () => {
    if (!isChecked) {
      document.body.style.backgroundColor = "white";
      document.body.style.color = "#0c162e";
      checkboxRef.current = true;
    } else {
      document.body.style.backgroundColor = "#0c162e";
      document.body.style.color = "white";
      checkboxRef.current = false;
    }
    if (isChecked) {
      localStorage.setItem("isChecked", "false");
    } else {
      localStorage.setItem("isChecked", "true");
    }
    setIsChecked(!isChecked);
  };

  useEffect(() => {
    const setCheckboxValue = () => {
      if (localStorage.getItem("isChecked") === null) {
        checkboxRef.current = false;
      }
      if (!isChecked && localStorage.getItem("isChecked") === "true") {
        checkboxRef.current = true;
        setIsChecked((isChecked) => true);
      } else if (!isChecked && localStorage.getItem("isChecked") === "false") {
        checkboxRef.current = false;
      } else if (isChecked || localStorage.getItem("isChecked") === "true") {
        checkboxRef.current = true;
      }
    };

    setCheckboxValue();
  }, []);

  return (
    <div className="ToggleSwitch">
      <label className="switch" htmlFor="slider">
        <input
          ref={checkboxRef}
          data-testid="toggle"
          type="checkbox"
          id="slider"
          checked={checkboxRef.current}
          onClick={changeBackground}
        />
        <div className="round"></div>
      </label>
    </div>
  );
}
