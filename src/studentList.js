import React, { useRef } from "react";
import axios from "axios";
import CurbsideNumberForm from "./Form";
import Horseshoe from "./horseshoe.png";
import "./studentList.css";

export default function StudentList({ curbsideData }) {
  const { curbsideNames, setCurbsideNames } = curbsideData;
  const ulRef = useRef();
  const ulTogglerRef = useRef();

  const getOneNumberFromNameString = (nameString) => {
    return nameString.split(":")[0].replace("#", "");
  };
  const getMultipleNumbersFromNameString = (msg) => {
    if (!msg) return;
    const pattern = /\d+/g;
    console.log(msg.match(pattern).join("+"));
    return msg.match(pattern).join("+");
  };

  const removeName = async (name) => {
    const updatedCurbsideNames = curbsideNames.filter(
      (curbsideName) => curbsideName !== name
    );

    const curbsideNumber =
      name.split("#").length > 2
        ? getMultipleNumbersFromNameString(name)
        : getOneNumberFromNameString(name);
    await axios.patch(
      // `https://yowell-curbside.herokuapp.com/${curbsideNumber}`,
      `http://127.0.0.1:3001/${curbsideNumber}`,
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
      <div className="horseshoe-container">
        <img id="horseshoe" src={Horseshoe} alt="horseshoe" />
      </div>
      <CurbsideNumberForm curbsideData={curbsideData} />
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
