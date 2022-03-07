import axios from "axios";
import { getCorrectNumberToAddStudents } from "./helpers";

const BASE_URL = `https://yowell-curbside.herokuapp.com`;

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
