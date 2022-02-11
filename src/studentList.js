import React, { useState, useRef } from "react";
import CurbsideNumberForm from "./Form";
import "./studentList.css";

export default function StudentList() {
  const [curbsideNames, setCurbsideNames] = useState([]);
  const ulRef = useRef();
  const ulTogglerRef = useRef();

  const removeName = (name) => {
    const updatedCurbsideNames = curbsideNames.filter(
      (curbsideName) => curbsideName !== name
    );
    setCurbsideNames([...updatedCurbsideNames]);
  };

  const toggleUlVisibility = () => {
    ulRef.current.classList.toggle("show");
    ulTogglerRef.current.classList.toggle("fa-angle-up");
  };

  const studentsInQueue = () => {
    return curbsideNames.map((name) => (
      <div className="listItem" key={name}>
        <li>{name}</li>
        <i
          id="remove"
          className="fa-solid fa-x"
          onClick={() => removeName(name)}
        ></i>
      </div>
    ));
  };

  return (
    <div className="StudentList">
      <CurbsideNumberForm
        curbsideNames={curbsideNames}
        setCurbsideNames={setCurbsideNames}
      />
      <div className="ul-holder">
        <i
          id="showUl"
          ref={ulTogglerRef}
          className="fa-solid fa-angle-down"
          onClick={toggleUlVisibility}
        ></i>
        <ul ref={ulRef}>{studentsInQueue()}</ul>
      </div>
    </div>
  );
}
