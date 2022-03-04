import React, { useState } from "react";
import axios from "axios";
import useWebSocketLite from "./webSocketHook";
import "./Form.css";

export default function CurbsideNumberForm({ curbsideData }) {
  const [curbsideNumber, setCurbsideNumber] = useState("");
  const { curbsideNames, setCurbsideNames, usedNumbers, setUsedNumbers } =
    curbsideData;

  const ws = useWebSocketLite({
    // socketUrl: "wss://yowell-curbside.herokuapp.com/",
    socketUrl: "ws://127.0.0.1:3001/",
    curbsideData: curbsideNames,
    setCurbsideData: setCurbsideNames,
    setUsedNumbers: setUsedNumbers,
  });

  const handleChange = (evt) => {
    const { value } = evt.target;
    setCurbsideNumber(value);
  };

  const getNumFromStudent = (msg) => {
    if (!msg) return;
    const pattern = /\d+/g;
    return msg.match(pattern);
  };

  const studentIsInList = (number) => {
    if (!curbsideNames.length) return false;
    for (let student of curbsideNames) {
      // const studentNum = student.split(":")[0].replace("#", "");
      const studentNums = getNumFromStudent(curbsideNames.join(""));
      console.log(studentNums);

      // if (studentNum === number) {
      //   console.log("yes");
      //   return true;
      // }
      let allNumbers;
      if (number.split("+").length > 1) {
        allNumbers = number.split("+");
        if (allNumbers.some((n) => studentNums.includes(n))) {
          return true;
        }
      }
      if (studentNums.find((n) => n === number)) {
        return true;
      }
    }
    return false;
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    console.log(studentIsInList(curbsideNumber));
    if (
      usedNumbers.indexOf(curbsideNumber) === -1 &&
      !studentIsInList(curbsideNumber)
    ) {
      await axios.patch(
        // `https://yowell-curbside.herokuapp.com/${curbsideNumber}`,
        `http://127.0.0.1:3001/${curbsideNumber}`,
        {
          number: curbsideNumber,
        }
      );

      ws.send(`add_${curbsideNumber}`);
    }
    setCurbsideNumber("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="curbsideNumber">Curbside number</label>
      <input
        type="tel"
        placeholder="Enter number here"
        id="curbsideNumber"
        value={curbsideNumber}
        onChange={handleChange}
        name="curbsideNumber"
        required
      />
      <button className="studentNumber" type="submit">
        Submit
      </button>
    </form>
  );
}
