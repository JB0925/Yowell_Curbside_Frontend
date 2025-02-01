import React, { useState } from "react";
import { v4 as uuid } from "uuid";
import "./MainList.css";

export default function MainList({ allStudents }) {
  const { everyStudent } = allStudents;
  const [studentName, setStudentName] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (evt) => {
    setStudentName((studentName) => evt.target.value);
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    const name = studentName.trim();
    if (everyStudent.some((student) => student.name.trim() === name)) {
      const existingStudent = everyStudent
        .filter((st) => st.name.trim() === name)
        .pop();
      setMessage(`Yes; Number: ${existingStudent.number} Name: ${name}`);
      setTimeout(() => setMessage((message) => ""), 2000);
    } else if (
      everyStudent.some(
        (student) =>
          student.name
            .trim()
            .toLowerCase()
            .split(" ")
            .indexOf(name.toLowerCase()) !== -1
      )
    ) {
      const maybeMatchingStudents = everyStudent
        .filter(
          (student) =>
            student.name
              .trim()
              .toLowerCase()
              .split(" ")
              .indexOf(name.toLowerCase()) !== -1
        )
        .map((student) => student.number + "  " + student.name + "\n\n")
        .join("");
      setMessage(
        `We aren't sure which one you are looking for!
         Here's a list of similar names that we found:\n
         ${maybeMatchingStudents}`
      );
      setTimeout(() => setMessage((message) => ""), 8000);
    } else {
      setMessage("This student is not in the database!");
      setTimeout(() => setMessage((message) => ""), 2000);
    }
    setStudentName("");
  };

  const displayAllStudents = () => {
    if (!everyStudent.length) return;
    const studentList = everyStudent.filter((student) => student !== undefined)
    .map(({ number, name }) => (
      <div className="allStudents" key={uuid()}>
        <p>{number}</p>
        <p>{name}</p>
      </div>
    ));

    return <div className="studentListContainer">{studentList}</div>;
  };

  const getNextNumberToAdd = () => {
    if (!everyStudent.length) return;
    const studentList = everyStudent
      .filter((student) => student !== undefined)
      .map((student) => parseInt(student.number))
      .filter((n) => n < 400);

    for (let i = 0; i < studentList.length; i++) {
      if (studentList[i] !== i + 1) {
        return studentList[i] - 1;
      }
    }

    return (
      everyStudent
        .map((student) => parseInt(student.number))
        .filter((n) => n < 400)
        .pop() + 1
    );
  };

  return (
    <div className="allStudentsContainer">
      <form onSubmit={handleSubmit}>
        <label htmlFor="hame">Looking for a student?</label>
        <input
          placeholder="Enter a student name"
          value={studentName}
          name="name"
          id="name"
          required
          type="text"
          onChange={handleChange}
        />
        <button type="submit" id="searchBtn">Submit</button>
        <p id="message">{message.length ? message : null}</p>
      </form>
      <p className="nextNumber">{`Next number should be: ${getNextNumberToAdd()}`}</p>
      {displayAllStudents()}
    </div>
  );
}
