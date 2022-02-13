import axios from "axios";
import React, { useState } from "react";
import "./addStudent.css";

export default function AddStudent({ toggleSidebar }) {
  const BASE_URL =
    "https://yowell-curbside.herokuapp.com/" || "http://127.0.0.1:3001";
  const initialState = {
    number: "",
    name: "",
  };

  const [studentData, setStudentData] = useState(initialState);
  const [userFeedback, setUserFeedback] = useState("");

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setStudentData((studentData) => ({
      ...studentData,
      [name]: value,
    }));
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    axios
      .post(BASE_URL, studentData)
      .then(() => setUserFeedback("Student added successfully!"))
      .catch(() => setUserFeedback("An error occurred."));
    setStudentData(initialState);
    setTimeout(() => toggleSidebar(), 1000);
  };

  const giveUserFeedback = () => {
    if (!userFeedback.length) return;
    if (userFeedback === "Student added successfully!") {
      return <p className="success">{userFeedback}</p>;
    }

    return <p className="error">{userFeedback}</p>;
  };

  return (
    <div className="addStudent">
      <p>Add a Student</p>
      <form onSubmit={handleSubmit} id="addStudentForm">
        <label htmlFor="number">Curbside number</label>
        <input
          type="text"
          placeholder="Enter number here"
          id="number"
          value={studentData.number}
          onChange={handleChange}
          name="number"
          required
        />
        <label htmlFor="number">Student name</label>
        <input
          type="text"
          placeholder="Enter student name"
          id="name"
          value={studentData.name}
          onChange={handleChange}
          name="name"
          required
        />
        <button className="studentNumber" type="submit">
          Submit
        </button>
      </form>
      {userFeedback.length ? giveUserFeedback() : null}
    </div>
  );
}
