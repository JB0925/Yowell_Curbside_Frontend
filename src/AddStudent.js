import axios from "axios";
import React, { useState, useEffect } from "react";
import { BASE_URL } from "./baseUrls";
import "./addStudent.css";

export default function AddStudent({ toggleSidebar, isChecked }) {
  const initialState = {
    number: "",
    name: "",
  };

  const [studentData, setStudentData] = useState(initialState);
  const [userFeedback, setUserFeedback] = useState("");
  const [nextNumber, setNextNumber] = useState(null);

  useEffect(() => {
    const getNextNumberToAdd = async () => {
      const response = await axios.get(`${BASE_URL}/students/studentList`);
      const { studentList } = response.data;
      let nextNumberUp =
        studentList
          .map((student) => parseInt(student.number))
          .filter((n) => n < 400)
          .pop() + 1;

      setNextNumber((n) => nextNumberUp);
    };

    getNextNumberToAdd();
  }, []);

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
      .then(() => {
        if (nextNumber) setNextNumber(nextNumber + 1);
      })
      .catch(() => setUserFeedback("An error occurred."));
    setStudentData(initialState);
    setTimeout(() => toggleSidebar(), 1000);
  };

  const giveUserFeedback = () => {
    if (!userFeedback.length) return;
    const classNameToAdd =
      userFeedback === "Student added successfully!" ? "success" : "error";

    return <p className={classNameToAdd}>{userFeedback}</p>;
  };

  const formStyle = {
    border: isChecked ? "1px solid #0c162e" : "",
  };

  return (
    <div className="addStudent">
      <p className="nextUp">
        Add a Student - Next Number: {nextNumber === null ? null : nextNumber}
      </p>
      <form onSubmit={handleSubmit} id="addStudentForm" style={formStyle}>
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
