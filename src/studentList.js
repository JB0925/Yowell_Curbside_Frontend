import React, { useState } from "react";
import CurbsideNumberForm from "./Form";
import "./studentList.css";

export default function StudentList() {
  const [curbsideNames, setCurbsideNames] = useState([]);

  const removeName = (name) => {
    const updatedCurbsideNames = curbsideNames.filter(
      (curbsideName) => curbsideName !== name
    );
    setCurbsideNames([...updatedCurbsideNames]);
  };

  const studentsInQueue = () => {
    return curbsideNames.map((name) => (
      <div className="listItem">
        <li>{name}</li>
        <i class="fa-solid fa-x" onClick={() => removeName(name)}></i>
      </div>
    ));
  };

  return (
    <div className="StudentList">
      <CurbsideNumberForm
        curbsideNames={curbsideNames}
        setCurbsideNames={setCurbsideNames}
      />
      <ul>{studentsInQueue()}</ul>
    </div>
  );
}
