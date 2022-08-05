import React, { useState } from "react";
import { useHistory } from "react-router-dom";

export default function Login() {
  const ACL_USERNAME = process.env.REACT_APP_ACL_USERNAME;
  console.log(ACL_USERNAME);
  const ACL_PASSWORD = process.env.REACT_APP_ACL_PASSWORD;
  console.log(ACL_PASSWORD);
  const initialFormState = { username: "", password: "" };
  const [formState, setFormState] = useState(initialFormState);
  const history = useHistory();

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setFormState((formState) => ({
      ...formState,
      [name]: value,
    }));
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    const { username, password } = formState;
    if (username === ACL_USERNAME && password === ACL_PASSWORD) {
      window.localStorage.setItem("allowListed", true);
      setFormState(initialFormState);
      history.push("/");
    }
    setFormState(initialFormState);
  };

  return (
    <div className="login">
      <h1>Staff Login</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          placeholder="Enter username here"
          id="username"
          value={formState.username}
          onChange={handleChange}
          name="username"
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          placeholder="Enter password here"
          id="password"
          value={formState.password}
          onChange={handleChange}
          name="password"
        />
        <button className="studentNumber" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
}
