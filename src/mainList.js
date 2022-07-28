import React, { useEffect, useState } from "react";
import { BASE_URL } from "./baseUrls";
import axios from "axios";
import { v4 as uuid } from "uuid";
import "./MainList.css";

export default function MainList() {
  const [everyStudent, setEveryStudent] = useState([]);

  useEffect(() => {
    const getEveryStudent = async () => {
      const response = await axios.get(`${BASE_URL}/students/studentList`);
      const { studentList } = response.data;
      setEveryStudent((everyStudent) => [...studentList]);
    };

    getEveryStudent();
  }, []);

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
