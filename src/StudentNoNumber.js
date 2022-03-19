import React, { useState } from "react";
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

  const handleSubmit = (evt) => {
    evt.preventDefault();
    setStudentName((studentName) => "");
    toggleFunc();
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
