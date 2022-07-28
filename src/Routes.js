import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Admin from "./Admin";
import MainList from "./mainList";
import StudentList from "./studentList";

export default function Routes({ curbsideData, sendFunc }) {
  return (
    <Switch>
      <Route exact path="/">
        <StudentList curbsideData={curbsideData} sendFunc={sendFunc} />
      </Route>
      <Route exact path="/admin">
        <Admin />
      </Route>
      <Route exact path="/studentList">
        <MainList />
      </Route>
      <Redirect to="/" />
    </Switch>
  );
}
