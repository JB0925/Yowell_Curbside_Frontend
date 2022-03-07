import axios from "axios";
import { getCorrectNumberToAddStudents } from "./helpers";

const BASE_URL = `http://127.0.0.1:3001`;

class curbsideAPI {
  static async addStudentToList(
    curbsideNumber,
    curbsideNumberWithNumberFromStudentName,
    additionalNumber
  ) {
    try {
      await axios.patch(
        // `https://yowell-curbside.herokuapp.com/${curbsideNumber}`,
        // `http://127.0.0.1:3001/students/add/${curbsideNumberWithNumberFromStudentName}`,
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
}

export default curbsideAPI;
