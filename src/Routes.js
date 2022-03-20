import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Admin from "./Admin";
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
      <Redirect to="/" />
    </Switch>
  );
}
