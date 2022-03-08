import { useRef, useState, useEffect } from "react";
import YESLogo from "./YESLogo2.png";
import "./App.css";
import AddStudent from "./AddStudent";
import Routes from "./Routes";
import curbsideAPI from "./curbsideAPI";

function App() {
  const burgerRef = useRef();
  const sidebarRef = useRef();

  const toggleSidebar = () => {
    sidebarRef.current.classList.toggle("open");
  };

  const [curbsideNames, setCurbsideNames] = useState([]);
  const [usedNumbers, setUsedNumbers] = useState([]);
  useEffect(() => {
    const getLoadedStudents = async () => {
      const response = await curbsideAPI.getStatusOfCurrentlyLoadedStudents();
      let { loadedStudents } = response.data;
      if (loadedStudents.length) {
        let [studentNamesArray, studentNumbersArray] = loadedStudents;
        studentNamesArray = studentNamesArray.map((n) => n.info);
        setCurbsideNames((curbsideNames) => [...studentNamesArray]);
        setUsedNumbers((usedNumbers) => [...studentNumbersArray]);
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
      <Routes curbsideData={curbsideData} />
    </div>
  );
}

export default App;
