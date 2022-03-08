import axios from "axios";
import { getCorrectNumberToAddStudents } from "./helpers";
import { BASE_URL } from "./baseUrls";

// const BASE_URL =
//   `https://yowell-curbside.herokuapp.com` || `http://127.0.0.1:3001`;

class curbsideAPI {
  static async addStudentToList(
    curbsideNumber,
    curbsideNumberWithNumberFromStudentName,
    additionalNumber
  ) {
    try {
      await axios.patch(
        // `https://yowell-curbside.herokuapp.com/${curbsideNumber}`,
        `${BASE_URL}/students/add/${curbsideNumberWithNumberFromStudentName}`,
        {
          number: getCorrectNumberToAddStudents(
            curbsideNumber,
            additionalNumber
          ),
        }
      );
    } catch (error) {
      return;
    }
  }

  static async removeStudentFromList(curbsideNumber) {
    try {
      await axios.patch(
        `${BASE_URL}/students/remove/${curbsideNumber}`,
        // `http://127.0.0.1:3001/students/remove/${curbsideNumber}`,
        {
          number: curbsideNumber,
        }
      );
    } catch (error) {
      return;
    }
  }

  static async getStudentDataByFullName(studentName) {
    try {
      const response = await axios.get(
        `${BASE_URL}/students/fullName/${studentName}`
      );
      return response.data.name;
    } catch (error) {
      return;
    }
  }

  static async getStatusOfCurrentlyLoadedStudents() {
    try {
      const response = await axios.get(
        `${BASE_URL}/students/status`
        // "http://127.0.0.1:3001/students/status"
      );
      return response;
    } catch (error) {
      return;
    }
  }

  static async resetAll() {
    try {
      const response = await axios.get(`${BASE_URL}/students/resetAll`);
      return response.data.message;
    } catch (error) {
      return;
    }
  }
}

export default curbsideAPI;
