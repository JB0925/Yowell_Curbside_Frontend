import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import CurbsideNumberForm from "./Form";
import "./studentList.css";

export default function StudentList() {
  const [curbsideNames, setCurbsideNames] = useState([]);
  const ulRef = useRef();
  const ulTogglerRef = useRef();

  useEffect(() => {
    const getLoadedStudents = async () => {
      const response = await axios.get(
        "https://yowell-curbside.herokuapp.com/students/status"
      );

      const { loadedStudents } = response.data;
      loadedStudents.length &&
        setCurbsideNames((curbsideNames) => [...loadedStudents]);
    };

    getLoadedStudents();
  }, []);

  const getNumberFromNameString = (nameString) => {
    return nameString.split(":")[0].replace("#", "");
  };

  const removeName = async (name) => {
    const updatedCurbsideNames = curbsideNames.filter(
      (curbsideName) => curbsideName !== name
    );

    const curbsideNumber = getNumberFromNameString(name);
    await axios.patch(
      `https://yowell-curbside.herokuapp.com/${curbsideNumber}`,
      {
        number: curbsideNumber,
      }
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
