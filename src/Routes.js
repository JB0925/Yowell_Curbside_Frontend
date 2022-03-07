import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Admin from "./Admin";
import StudentList from "./studentList";

export default function Routes({ curbsideData }) {
  return (
    <Switch>
      <Route exact path="/">
        <StudentList curbsideData={curbsideData} />
      </Route>
      <Route exact path="/admin">
        <Admin />
      </Route>
      <Redirect to="/" />
    </Switch>
  );
}
