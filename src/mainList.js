import React from "react";
import { v4 as uuid } from "uuid";
import "./MainList.css";

export default function MainList({ allStudents }) {
  const { everyStudent } = allStudents;

  const displayAllStudents = () => {
    if (!everyStudent.length) return;
    const studentList = everyStudent.map(({ number, name }) => (
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
      <p className="nextNumber">{`Next number should be: ${getNextNumberToAdd()}`}</p>
      {displayAllStudents()}
    </div>
  );
}
