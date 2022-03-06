const debounce = (func) => {
  let timer;
  return () => {
    clearTimeout(timer);
    timer = setTimeout(() => func(), 150);
  };
};

const getCorrectNumberToAddStudents = (curbsideNumber, studentName) => {
  if (!studentName && !curbsideNumber) return;
  if (!studentName) return curbsideNumber;
  if (!curbsideNumber) return studentName;
  if (curbsideNumber.length && studentName.length) {
    return `${curbsideNumber}+${studentName}`;
  } else if (curbsideNumber.length && !studentName.length) {
    return curbsideNumber;
  } else if (studentName.length && !curbsideNumber.length) {
    return studentName;
  } else return;
};

export { debounce, getCorrectNumberToAddStudents };
