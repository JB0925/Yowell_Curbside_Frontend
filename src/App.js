import { useRef, useState, useEffect } from "react";
import YESLogo from "./YESLogo2.png";
import YESHorseLogo from "./Yowell_Horse_Logo.jpeg";
import "./App.css";
import AddStudent from "./AddStudent";
import Routes from "./Routes";
import curbsideAPI from "./curbsideAPI";
import StudentNoNumberForm from "./StudentNoNumber";
import { BASE_SOCKET_URL } from "./baseUrls";
import useWebSocketLite from "./webSocketHook";
import ToggleSwitch from "./toggleSwitch";

function App() {
  const burgerRef = useRef();
  const sidebarRef = useRef();
  const formRef = useRef();

  const [curbsideNames, setCurbsideNames] = useState([]);
  const [usedNumbers, setUsedNumbers] = useState([]);
  const [isChecked, setIsChecked] = useState(false);

  const ws = useWebSocketLite({
    socketUrl: BASE_SOCKET_URL,
    curbsideData: curbsideNames,
    setCurbsideData: setCurbsideNames,
    setUsedNumbers: setUsedNumbers,
  });

  const toggleSidebar = () => {
    sidebarRef.current.classList.toggle("open");
  };

  const toggleForm = () => {
    const current = formRef.current;

    if (current.classList.contains("grow")) {
      current.classList.remove("grow");
      for (let child of current.children) {
        child.children[0].style.display = "none";
      }
    } else {
      current.classList.add("grow");
      for (let child of current.children) {
        child.children[0].style.display = "flex";
      }
    }
  };

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
    isChecked,
  };

  const checkState = { isChecked, setIsChecked };

  const burgerRefStyle = { color: isChecked ? "#0c162e" : "white" };
  const sidebarRefStyle = {
    color: isChecked ? "#0c162e" : "white",
    backgroundColor: isChecked ? "white" : "#0c162e",
    border: isChecked ? "1px solid #0c162e" : "",
  };

  const sidebarContainerStyle = {
    backgroundColor: isChecked ? "0c162e" : "",
  };

  return (
    <div className="App">
      <nav>
        <img src={!isChecked ? YESLogo : YESHorseLogo} alt="school logo" />
        <h1 id="header" onClick={toggleForm}>
          YES Curbside!
        </h1>
        <i
          style={burgerRefStyle}
          id="burgerMenu"
          className="fa-solid fa-bars"
          ref={burgerRef}
          onClick={toggleSidebar}
        ></i>
      </nav>
      <ToggleSwitch checkState={checkState} />
      <div className="noNumber-container" ref={formRef}>
        <div className="wrapper">
          <StudentNoNumberForm
            curbsideData={curbsideData}
            toggleFunc={toggleForm}
            sendFunc={ws}
          />
        </div>
      </div>
      <div
        className="sidebar-container"
        ref={sidebarRef}
        // style={sidebarContainerStyle}
      >
        <div className="sidebar" style={sidebarRefStyle}>
          <i
            id="closeBtn"
            className="fas fa-window-close"
            onClick={toggleSidebar}
          ></i>
          <AddStudent toggleSidebar={toggleSidebar} isChecked={isChecked} />
        </div>
      </div>
      <Routes curbsideData={curbsideData} sendFunc={ws} />
    </div>
  );
}

export default App;
