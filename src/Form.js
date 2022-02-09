import React, { useState } from "react";
import curbsideNumbers from "./namesAndNumbers";
import "./Form.css";

export default function CurbsideNumberForm({
  curbsideNames,
  setCurbsideNames,
}) {
  const [curbsideNumber, setCurbsideNumber] = useState("");

  const handleChange = (evt) => {
    const { value } = evt.target;
    setCurbsideNumber(value);
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();

    const nameToAdd = curbsideNumbers[curbsideNumber];
    if (nameToAdd && curbsideNames.indexOf(nameToAdd) === -1) {
      setCurbsideNames((curbsideNames) => [...curbsideNames, nameToAdd]);
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
