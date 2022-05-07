import React, { useRef } from "react";
import CurbsideNumberForm from "./Form";
import Horseshoe from "./horseshoe.png";
import Horse from "./darkerHorseshoe.jpg";
import "./studentList.css";
import curbsideAPI from "./curbsideAPI";

export default function StudentList({ curbsideData, sendFunc }) {
  const { curbsideNames, setCurbsideNames, isChecked } = curbsideData;
  const ulRef = useRef();
  const ulTogglerRef = useRef();

  const getOneNumberFromNameString = (nameString) => {
    return nameString.split(":")[0].replace("#", "");
  };
  const getMultipleNumbersFromNameString = (msg) => {
    if (!msg) return;
    const pattern = /\d+/g;
    return msg.match(pattern).join("+");
  };

  const removeName = async (name) => {
    const updatedCurbsideNames = curbsideNames.filter(
      (curbsideName) => curbsideName !== name
    );

    const pattern = /\d+/g;
    if (
      (name.match(pattern) &&
        name.match(pattern).length === 1 &&
        parseInt(name.match(pattern)[0]) >= 500) ||
      !name.match(pattern)
    ) {
      await curbsideAPI.removeStudentWithNoNumberFromList(name);
      setCurbsideNames([...updatedCurbsideNames]);
      sendFunc.send(`remove_${name}`);
      return;
    }

    const curbsideNumber =
      name.split("#").length > 2
        ? getMultipleNumbersFromNameString(name)
        : getOneNumberFromNameString(name);

    await curbsideAPI.removeStudentFromList(curbsideNumber);
    setCurbsideNames([...updatedCurbsideNames]);
    sendFunc.send(`remove_${name}`);
  };

  const toggleUlVisibility = () => {
    ulRef.current.classList.toggle("show");
    ulTogglerRef.current.classList.toggle("fa-angle-up");
  };

  const toggleStudentDivStyle = {
    color: "white",
    backgroundColor:
      isChecked || localStorage.getItem("isChecked") === "true"
        ? "#0c162e"
        : "",
    border:
      isChecked || localStorage.getItem("isChecked") === "true"
        ? "1px solid red"
        : "",
  };

  const imageStyle = {
    width:
      isChecked || localStorage.getItem("isChecked") === "true" ? "45%" : "",
    height:
      isChecked || localStorage.getItem("isChecked") === "true" ? "45%" : "",
  };

  const studentsInQueue = () => {
    return curbsideNames.map((name) => (
      <div className="listItem" key={name} style={toggleStudentDivStyle}>
        <li>{name}</li>
        <i
          id="remove"
          data-testid="removeBtn"
          className="fa-solid fa-x"
          onClick={() => removeName(name)}
        ></i>
      </div>
    ));
  };

  return (
    <div className="StudentList">
      <div className="horseshoe-container">
        <img
          style={imageStyle}
          id="horseshoe"
          src={
            isChecked || localStorage.getItem("isChecked") === "true"
              ? Horse
              : Horseshoe
          }
          alt="horseshoe"
        />
      </div>
      <CurbsideNumberForm curbsideData={curbsideData} sendFunc={sendFunc} />
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
