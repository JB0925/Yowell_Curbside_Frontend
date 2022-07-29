import React, { useState, useRef, useEffect } from "react";
import { debounce } from "./helpers";
import curbsideAPI from "./curbsideAPI";
import { v4 as uuid } from "uuid";
import "./Form.css";

export default function CurbsideNumberForm({ curbsideData, sendFunc }) {
  const initialState = {
    curbsideNumber: "",
    studentName: "",
  };

  const [formState, setFormState] = useState(initialState);
  const [nameMatches, setNameMatches] = useState([]);
  const autoCompleteRef = useRef();
  const containerRef = useRef();
  const { curbsideNames, usedNumbers, isChecked } = curbsideData;

  useEffect(() => {
    const getPartialMatches = async () => {
      const currentName = autoCompleteRef.current.value;
      if (!currentName.length) {
        setNameMatches([]);
        containerRef.current.classList.add("hide");
        return;
      }

      await curbsideAPI.getStudentsByPartialName(
        currentName,
        setNameMatches,
        containerRef
      );
    };

    autoCompleteRef.current.addEventListener(
      "input",
      debounce(getPartialMatches)
    );
  }, []);

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setFormState((formState) => ({
      ...formState,
      [name]: value,
    }));
  };

  const getNumFromStudent = (msg) => {
    if (!msg) return;
    const pattern = /\d+/g;
    return msg.match(pattern);
  };

  const studentIsInNamesList = (number) => {
    if (!curbsideNames.length) return false;

    const studentNums = getNumFromStudent(curbsideNames.join(""));
    if (!studentNums) return false;

    if (studentNums.find((n) => n === number)) {
      return true;
    }

    let allNumbers = number.split("+");
    if (
      allNumbers.length > 1 &&
      allNumbers.some((n) => studentNums.includes(n))
    ) {
      return true;
    }

    return false;
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    if (
      usedNumbers.indexOf(formState.curbsideNumber) === -1 &&
      !studentIsInNamesList(formState.curbsideNumber)
    ) {
      const numberString = await curbsideAPI.addStudentToList(
        formState.curbsideNumber,
        formState.studentName
      );
      if (numberString === undefined) {
        setFormState(initialState);
        return;
      }
      sendFunc.send(`add_${numberString}`);
    }
    setFormState(initialState);
  };

  const handleClick = (evt) => {
    containerRef.current.classList.toggle("hide");
    autoCompleteRef.current.value = evt.target.innerText;
    setFormState((formState) => ({
      ...formState,
      studentName: evt.target.innerText,
    }));
  };

  const getNamesForAutocomplete = () => {
    return nameMatches.map((name) => (
      <div className="autocomplete-name" onClick={handleClick} key={uuid()}>
        {name}
      </div>
    ));
  };

  const closeAutocomplete = () => {
    if (!containerRef.current.classList.contains("hide")) {
      containerRef.current.classList.add("hide");
      setFormState((formState) => ({
        ...formState,
        studentName: "",
      }));
    }
  };

  const formStyle = {
    backgroundColor:
      isChecked || localStorage.getItem("isChecked") === "true"
        ? "rgba(12, 22, 46, 1)"
        : "",
    color:
      isChecked || localStorage.getItem("isChecked") === "true" ? "white" : "",
    border:
      isChecked || localStorage.getItem("isChecked") === "true"
        ? "1px solid white"
        : "",
  };

  return (
    <form onSubmit={handleSubmit} onClick={closeAutocomplete} style={formStyle}>
      <label htmlFor="curbsideNumber">Curbside number</label>
      <input
        type="tel"
        placeholder="Enter number here"
        id="curbsideNumber"
        value={formState.curbsideNumber}
        onChange={handleChange}
        name="curbsideNumber"
      />
      <label htmlFor="studentName">Student name</label>
      <input
        ref={autoCompleteRef}
        type="text"
        placeholder="Enter name here"
        id="studentName"
        value={formState.studentName}
        onChange={handleChange}
        name="studentName"
      />
      <div className="autocomplete-container hide" ref={containerRef}>
        <div className="autocomplete">
          {nameMatches.length && getNamesForAutocomplete()}
        </div>
      </div>
      <button className="studentNumber" type="submit">
        Submit
      </button>
    </form>
  );
}
