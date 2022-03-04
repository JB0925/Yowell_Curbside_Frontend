import { useRef, useState, useEffect } from "react";
import axios from "axios";
import YESLogo from "./YESLogo2.png";
import StudentList from "./studentList";
import "./App.css";
import AddStudent from "./AddStudent";

function App() {
  const burgerRef = useRef();
  const sidebarRef = useRef();

  const toggleSidebar = () => {
    sidebarRef.current.classList.toggle("open");
  };

  const [curbsideNames, setCurbsideNames] = useState([]);
  const [usedNumbers, setUsedNumbers] = useState([]);
  console.log(usedNumbers);
  useEffect(() => {
    const getLoadedStudents = async () => {
      const response = await axios.get(
        // "https://yowell-curbside.herokuapp.com/students/status"
        "http://127.0.0.1:3001/students/status"
      );

      let { loadedStudents } = response.data;
      console.log(loadedStudents);
      if (loadedStudents.length) {
        let [returnArray, numberArray] = loadedStudents;
        returnArray = returnArray.map((n) => n.info);
        setCurbsideNames((curbsideNames) => [...returnArray]);
        setUsedNumbers((usedNumbers) => [...numberArray]);
      }
    };

    getLoadedStudents();
  }, []);

  const curbsideData = {
    curbsideNames,
    setCurbsideNames,
    usedNumbers,
    setUsedNumbers,
  };

  return (
    <div className="App">
      <nav>
        <img src={YESLogo} alt="school logo" />
        <h1 id="header">YES Curbside!</h1>
        <i
          id="burgerMenu"
          className="fa-solid fa-bars"
          ref={burgerRef}
          onClick={toggleSidebar}
        ></i>
      </nav>
      <div className="sidebar-container" ref={sidebarRef}>
        <div className="sidebar">
          <i
            id="closeBtn"
            className="fas fa-window-close"
            onClick={toggleSidebar}
          ></i>
          <AddStudent toggleSidebar={toggleSidebar} />
        </div>
      </div>
      <StudentList
        // curbsideNames={curbsideNames}
        // setCurbsideNames={setCurbsideNames}
        curbsideData={curbsideData}
      />
    </div>
  );
}

export default App;
