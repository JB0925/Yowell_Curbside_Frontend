import React, { useState } from "react";
import curbsideNumbers from "./namesAndNumbers";
import "./Form.css";

export default function CurbsideNumberForm({ setCurbsideNames }) {
  const [curbsideNumber, setCurbsideNumber] = useState("");

  const handleChange = (evt) => {
    const { value } = evt.target;
    setCurbsideNumber(value);
  };

  const handleSubmit = (evt) => {
    if (curbsideNumbers[curbsideNumber]) {
      const nameToAdd = curbsideNumbers[curbsideNumber];
      setCurbsideNames((curbsideNames) => [...curbsideNames, nameToAdd]);
    }

    setCurbsideNumber("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="curbsideNumber">Enter the curbside number</label>
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
