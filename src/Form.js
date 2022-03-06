import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { debounce, getCorrectNumberToAddStudents } from "./helpers";
import "./Form.css";

export default function CurbsideNumberForm({ curbsideData, sendFunc }) {
  const initialState = {
    curbsideNumber: "",
    studentName: "",
  };

  const [formState, setFormState] = useState(initialState);
  const [nameMatches, setNameMatches] = useState([]);
  // const [curbsideNumber, setCurbsideNumber] = useState("");
  // const [studentName, setStudentName] = useState("");
  const autoCompleteRef = useRef();
  const containerRef = useRef();
  const { curbsideNames, setCurbsideNames, usedNumbers, setUsedNumbers } =
    curbsideData;

  // const ws = useWebSocketLite({
  //   // socketUrl: "wss://yowell-curbside.herokuapp.com/",
  //   socketUrl: "ws://127.0.0.1:3001/",
  //   curbsideData: curbsideNames,
  //   setCurbsideData: setCurbsideNames,
  //   setUsedNumbers: setUsedNumbers,
  // });

  useEffect(() => {
    const getPartialMatches = async () => {
      const currentName = autoCompleteRef.current.value;
      if (!currentName.length) {
        setNameMatches([]);
        containerRef.current.classList.add("hide");
        return;
      }
      const url = `http://127.0.0.1:3001/students/partialNames/${currentName}`;
      await axios.get(url).then((response) => {
        setNameMatches((nameMatches) => [...response.data.nameMatches]);
        containerRef.current.classList.remove("hide");
      });
    };

    autoCompleteRef.current.addEventListener(
      "input",
      debounce(getPartialMatches)
    );
  }, [formState.studentName]);

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    // setCurbsideNumber(value);
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

  const studentIsInList = (number) => {
    if (!curbsideNames.length) return false;
    for (let student of curbsideNames) {
      const studentNums = getNumFromStudent(curbsideNames.join(""));

      let allNumbers;
      if (number.split("+").length > 1) {
        allNumbers = number.split("+");
        if (allNumbers.some((n) => studentNums.includes(n))) {
          return true;
        }
      }
      if (studentNums.find((n) => n === number)) {
        return true;
      }
    }
    return false;
  };

  const handleSubmit = async (evt) => {
    let additionalNumber;
    evt.preventDefault();
    if (formState.studentName.length) {
      const url = `http://127.0.0.1:3001/students/fullName/${formState.studentName}`;
      const response = await axios.get(url);
      additionalNumber = getNumFromStudent(response.data.name).join("");
      if (usedNumbers.indexOf(additionalNumber) !== -1) {
        setFormState(initialState);
        return;
      }
    }
    if (
      usedNumbers.indexOf(formState.curbsideNumber) === -1 &&
      !studentIsInList(formState.curbsideNumber)
    ) {
      const curbsideNumber = formState.curbsideNumber.length
        ? formState.curbsideNumber
        : additionalNumber;

      try {
        await axios.patch(
          // `https://yowell-curbside.herokuapp.com/${curbsideNumber}`,
          `http://127.0.0.1:3001/students/add/${curbsideNumber}`,
          {
            number: getCorrectNumberToAddStudents(
              formState.curbsideNumber,
              additionalNumber
            ),
          }
        );
      } catch (error) {
        return;
      }
      if (formState.studentName.length) {
        const url = `http://127.0.0.1:3001/students/fullName/${formState.studentName}`;
        const response = await axios.get(url);
        const additionalNumber = response.data.name;
        sendFunc.send(`add_${formState.curbsideNumber}+${additionalNumber}`);
      } else {
        sendFunc.send(`add_${formState.curbsideNumber}`);
      }
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
      <div className="autocomplete-name" onClick={handleClick}>
        {name}
      </div>
    ));
  };

  return (
    <form onSubmit={handleSubmit}>
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
