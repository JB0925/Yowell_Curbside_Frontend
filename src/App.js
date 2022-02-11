import { useRef } from "react";
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
      <div className="sidebar" ref={sidebarRef}>
        <AddStudent />
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
