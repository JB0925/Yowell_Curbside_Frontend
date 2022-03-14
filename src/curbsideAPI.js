import axios from "axios";
import { getCorrectNumberToAddStudents } from "./helpers";
import { BASE_URL } from "./baseUrls";

class curbsideAPI {
  static async addStudentToList(
    curbsideNumber,
    curbsideNumberWithNumberFromStudentName,
    additionalNumber
  ) {
    try {
      await axios.patch(
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
      await axios.patch(`${BASE_URL}/students/remove/${curbsideNumber}`, {
        number: curbsideNumber,
      });
    } catch (error) {
      return;
    }
  }

  static async getStudentsByPartialName(
    partialName,
    setListOfNames,
    autocompleteContainerRef
  ) {
    try {
      const response = await axios.get(
        `${BASE_URL}/students/partialNames/${partialName}`
      );
      setListOfNames((listOfNames) => [...response.data.nameMatches]);
      autocompleteContainerRef.current.classList.remove("hide");
    } catch (error) {
      setListOfNames((listOfNames) => []);
      autocompleteContainerRef.current.classList.add("hide");
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
      const response = await axios.get(`${BASE_URL}/students/status`);
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
