import React, { useRef } from "react";
import axios from "axios";
import CurbsideNumberForm from "./Form";
import Horseshoe from "./horseshoe.png";
import useWebSocketLite from "./webSocketHook";
import "./studentList.css";

export default function StudentList({ curbsideData }) {
  const { curbsideNames, setCurbsideNames, usedNumbers, setUsedNumbers } =
    curbsideData;
  const ulRef = useRef();
  const ulTogglerRef = useRef();

  const ws = useWebSocketLite({
    socketUrl: "wss://yowell-curbside.herokuapp.com/",
    // socketUrl: "ws://127.0.0.1:3001/",
    curbsideData: curbsideNames,
    setCurbsideData: setCurbsideNames,
    setUsedNumbers: setUsedNumbers,
  });

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

    const curbsideNumber =
      name.split("#").length > 2
        ? getMultipleNumbersFromNameString(name)
        : getOneNumberFromNameString(name);

    await axios.patch(
      `https://yowell-curbside.herokuapp.com/students/remove${curbsideNumber}`,
      // `http://127.0.0.1:3001/students/remove/${curbsideNumber}`,
      {
        number: curbsideNumber,
      }
    );
    setCurbsideNames([...updatedCurbsideNames]);
    ws.send(`remove_${name}`);
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
      <CurbsideNumberForm curbsideData={curbsideData} sendFunc={ws} />
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
