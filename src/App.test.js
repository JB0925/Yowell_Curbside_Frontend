import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import curbsideAPI from "./curbsideAPI";
import App from "./App";
import CurbsideNumberForm from "./Form";
import StudentList from "./studentList";

jest.mock("axios");

beforeEach(() => {
  jest.resetModules();
});

afterEach(() => {
  jest.resetAllMocks();
});

test("renders the app", async () => {
  axios.get.mockResolvedValueOnce({
    data: {
      loadedStudents: [],
    },
  });

  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(screen.getByText("YES Curbside!")).toBeInTheDocument();
  });
});

test("renders the Form component", async () => {
  const curbsideNames = ["#1 Joe", "#2 Tim"];
  const usedNumbers = ["1", "2"];
  const curbsideData = { curbsideNames, usedNumbers };
  const sendFunc = { send: jest.fn() };
  render(
    <CurbsideNumberForm curbsideData={curbsideData} sendFunc={sendFunc} />
  );

  const numberInput = screen.getByLabelText(/Curbside number/i);
  const nameInput = screen.getByLabelText(/Student name/i);

  fireEvent.change(numberInput, { target: { value: "37" } });
  expect(numberInput.value).toBe("37");

  fireEvent.click(screen.getByText("Submit"));
  await waitFor(() => {
    expect(numberInput.value).not.toBe("37");
  });

  jest
    .spyOn(curbsideAPI, "getStudentDataByFullName")
    .mockReturnValueOnce("#1: James Jones");

  userEvent.type(nameInput, "#1: Jam");
  await waitFor(() => {
    expect(nameInput.value).toBe("#1: Jam");
  });

  userEvent.type(nameInput, "es Jones");
  fireEvent.click(screen.getByText("Submit"));

  await waitFor(() => {
    expect(nameInput.value).toHaveLength(0);
  });
});

test("renders the Student List component", async () => {
  axios.get.mockResolvedValueOnce({
    data: {
      loadedStudents: [
        ["#1: Joe", "#2: Tim"],
        ["1", "2"],
      ],
    },
  });

  const curbsideNames = ["#1: Joe", "#2: Tim"];
  const usedNumbers = ["1", "2"];
  const setCurbsideNames = jest.fn((name) => [...curbsideNames, name]);
  const setUsedNumbers = jest.fn((num) => [...usedNumbers, num]);
  const curbsideData = {
    curbsideNames,
    usedNumbers,
    setCurbsideNames,
    setUsedNumbers,
  };
  render(<StudentList curbsideData={curbsideData} />);

  const numberInput = screen.getByLabelText(/Curbside number/i);
  const nameInput = screen.getByLabelText(/Student name/i);

  userEvent.type(numberInput, "37");
  fireEvent.click(screen.getByText("Submit"));
  const removeBtnForTim = screen.getAllByTestId("removeBtn")[1];

  await waitFor(() => {
    expect(numberInput.value).toHaveLength(0);
  });

  expect(screen.getByText("#1: Joe")).toBeInTheDocument();

  fireEvent.click(removeBtnForTim);
});
