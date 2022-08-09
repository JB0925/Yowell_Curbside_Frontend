import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { BASE_URL } from "./baseUrls";
import "./addStudent.css";

export default function AddStudent({ toggleSidebar, isChecked }) {
  const initialState = {
    number: "",
    name: "",
  };

  const allowListed = window.localStorage.getItem("allowListed") || null;

  const [studentData, setStudentData] = useState(initialState);
  const [userFeedback, setUserFeedback] = useState("");
  const [dataValidityMessage, setDataValidityMessage] = useState("");
  const [nextNumber, setNextNumber] = useState(null);
  const [timeoutArray, setTimeoutArray] = useState([]);
  const formRef = useRef();

  const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const digits = "1234567890";

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

  const resetFormAndSidebar = (message, doSetMessage = true) => {
    doSetMessage && setUserFeedback((userFeedback) => message);
    setTimeout(() => {
      toggleSidebar();
      setTimeout(() => setUserFeedback(""), 0);
    }, 1000);
    setStudentData(initialState);
  };

  const formSectionContainsBadData = (data, listToCheckAgainst) => {
    return data
      .split("")
      .some((char) => listToCheckAgainst.indexOf(char) === -1);
  };

  const handleKeyDown = (evt) => {
    if (evt.key === "Backspace" || evt.key === "Tab" || evt.key === " ") {
      return;
    }

    const { name } = evt.target;

    // Check to make sure the user is not entering letters where numbers
    // are supposed to go. If they are, warn them.
    if (name === "number" && formSectionContainsBadData(evt.key, digits)) {
      if (timeoutArray.length) {
        for (let id of timeoutArray) {
          clearTimeout(id);
        }
      }
      formRef.current.classList.add("check-data");
      setDataValidityMessage(
        (dataValidityMessage) =>
          "You are entering letters where numbers are supposed to go."
      );
      let newArray = [];
      let innerTimeout,
        outerTimeout = setTimeout(() => {
          formRef.current.classList.remove("check-data");
          innerTimeout = setTimeout(() => {
            setDataValidityMessage("");
            newArray.push(innerTimeout);
          }, 480);
        }, 2000);
      newArray.push(outerTimeout);
      setTimeoutArray((timeoutArray) => [...newArray]);
    }

    // Check to make sure the user is not entering numbers where letters
    // are supposed to go. If they are, warn them.
    if (name === "name" && formSectionContainsBadData(evt.key, alphabet)) {
      formRef.current.classList.add("check-data");
      setDataValidityMessage(
        (dataValidityMessage) =>
          "You are entering numbers where letters are supposed to go."
      );
      setTimeout(() => {
        formRef.current.classList.remove("check-data");
        setTimeout(() => setDataValidityMessage(""), 480);
      }, 2000);
    }
  };

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setStudentData((studentData) => ({
      ...studentData,
      [name]: value,
    }));
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    let message;
    if (!allowListed) {
      message = "Sorry, you must be logged in.";
      resetFormAndSidebar(message);
      // setUserFeedback((userFeedback) => "Sorry, you must be logged in.");
      // setTimeout(() => {
      //   toggleSidebar();
      //   setTimeout(() => setUserFeedback(""), 0);
      // }, 1000);
      // setStudentData(initialState);
      return;
    }

    if (
      formSectionContainsBadData(studentData.name, alphabet) ||
      formSectionContainsBadData(studentData.number, digits)
    ) {
      message = "Please double check your data before entering. :)";
      resetFormAndSidebar(message);
      // setUserFeedback(
      //   (userFeedback) => "Please double check your data before entering. :)"
      // );
      // setStudentData(initialState);
      // setTimeout(() => {
      //   toggleSidebar();
      //   setTimeout(() => setUserFeedback(""), 0);
      // }, 1000);
      return;
    }

    axios
      .post(BASE_URL, studentData)
      .then(() => setUserFeedback("Student added successfully!"))
      .then(() => {
        if (nextNumber) setNextNumber(nextNumber + 1);
      })
      .catch(() => setUserFeedback("An error occurred."));
    resetFormAndSidebar("", false);
    // setTimeout(() => {
    //   toggleSidebar();
    //   setTimeout(() => setUserFeedback(""), 0);
    // }, 1000);
    // setStudentData(initialState);
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
      {/* <p className="nextUp">
        Add a Student - Next Number: {nextNumber === null ? null : nextNumber}
      </p> */}
      <div className="data-validity" ref={formRef}>
        <p>{dataValidityMessage.length && dataValidityMessage}</p>
      </div>
      <form onSubmit={handleSubmit} id="addStudentForm" style={formStyle}>
        <label htmlFor="number">Curbside number</label>
        <input
          type="text"
          placeholder="Enter number here"
          id="number"
          value={studentData.number}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
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
          onKeyDown={handleKeyDown}
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
