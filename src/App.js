import { useRef } from "react";
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
  return (
    <div className="App">
      <nav>
        <img src={YESLogo} alt="school logo" />
        <h1 id="header">YES Curbside!</h1>
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
      <i
        id="burgerMenu"
        className="fa-solid fa-bars"
        ref={burgerRef}
        onClick={toggleSidebar}
      ></i>
      <StudentList />
    </div>
  );
}

export default App;
