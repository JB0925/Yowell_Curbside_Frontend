import React, { useState } from "react";
import axios from "axios";
import useWebSocketLite from "./webSocketHook";
import "./Form.css";

export default function CurbsideNumberForm({ curbsideData }) {
  const [curbsideNumber, setCurbsideNumber] = useState("");
  const { curbsideNames, setCurbsideNames, usedNumbers, setUsedNumbers } =
    curbsideData;
  console.log(curbsideNames);

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

  const studentIsInList = (number) => {
    console.log(curbsideNames);
    if (!curbsideNames.length) return false;
    for (let student of curbsideNames) {
      const studentNum = student.split(":")[0].replace("#", "");

      if (studentNum === number) {
        console.log("yes");
        return true;
      }
    }
    return false;
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
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
