import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Admin from "./Admin";
import Login from "./Login";
import MainList from "./mainList";
import StudentList from "./studentList";
import RequireAuth from "./requireAuth";

export default function Routes({ curbsideData, sendFunc }) {
  return (
    <Switch>
      <Route exact path="/" onEnter={RequireAuth()}>
        <StudentList curbsideData={curbsideData} sendFunc={sendFunc} />
      </Route>
      <Route exact path="/admin" onEnter={RequireAuth()}>
        <Admin />
      </Route>
      <Route exact path="/studentList" onEnter={RequireAuth()}>
        <MainList />
      </Route>
      <Route exact path="/login">
        <Login />
      </Route>
      <Redirect to="/" />
    </Switch>
  );
}
