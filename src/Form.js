import React, { useState } from "react";
import useWebSocketLite from "./webSocketHook";
import "./Form.css";

export default function CurbsideNumberForm({
  curbsideNames,
  setCurbsideNames,
}) {
  const [curbsideNumber, setCurbsideNumber] = useState("");
  const [usedNumbers, setUsedNumbers] = useState([]);

  const ws = useWebSocketLite({
    socketUrl: "https://yowell-curbside.herokuapp.com/",
    curbsideData: curbsideNames,
    setCurbsideData: setCurbsideNames,
    setUsedNumbers: setUsedNumbers,
  });

  const handleChange = (evt) => {
    const { value } = evt.target;
    setCurbsideNumber(value);
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    if (usedNumbers.indexOf(curbsideNumber) === -1) {
      ws.send(curbsideNumber);
    }
    setCurbsideNumber("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="curbsideNumber">Curbside number</label>
      <input
        type="text"
        placeholder="Enter number here"
        id="curbsideNumber"
        value={curbsideNumber}
        onChange={handleChange}
        name="curbsideNumber"
        required
      />
      <button type="submit">Submit</button>
    </form>
  );
}
