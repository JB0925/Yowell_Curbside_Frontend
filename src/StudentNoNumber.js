import React, { useState } from "react";
import curbsideAPI from "./curbsideAPI";
import "./StudentNoNumber.css";

export default function StudentNoNumberForm({
  curbsideData,
  sendFunc,
  toggleFunc,
}) {
  const [studentName, setStudentName] = useState("");

  const handleChange = (evt) => {
    setStudentName((studentName) => evt.target.value);
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    toggleFunc();
    const tempNumber = Math.floor(Math.random() * (999 - 500 + 1) + 500);
    const studentNameWithTempNumber = `#${tempNumber}: ${studentName}`;
    await curbsideAPI.addStudentWithNoNumberToList(studentNameWithTempNumber);
    sendFunc.send(`add_${studentNameWithTempNumber}`);
    setStudentName((studentName) => "");
    return;
  };

  return (
    <div className="StudentNoNumber">
      <form onSubmit={handleSubmit}>
        <div className="label-input">
          <label htmlFor="studentName">Student name - no number</label>
          <input
            type="text"
            id="studentName"
            placeholder="Enter student name"
            required
            onChange={handleChange}
            value={studentName}
            name="studentName"
          />
        </div>
        <button className="studentNumber" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
}
