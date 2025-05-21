/**
 * Utility functions for data formatting, conversion, and validation
 */

// Format a grade value to a letter grade
export const formatGradeToLetter = (nilai) => {
  if (nilai === null || nilai === undefined) return 'N/A';
  
  if (nilai >= 90) return 'A';
  if (nilai >= 80) return 'B';
  if (nilai >= 70) return 'C';
  if (nilai >= 60) return 'D';
  return 'E';
};

// Format a number to two decimal places (for displaying IP/GPA)
export const formatDecimal = (number) => {
  if (number === null || number === undefined) return 'N/A';
  return Number(number).toFixed(2);
};

// Convert object IDs to their respective values
export const objectIdToValue = (obj, field, idField = '_id', valueField = 'name') => {
  if (!obj || !obj[field]) return '';
  
  // If it's already a primitive value, return it
  if (typeof obj[field] !== 'object') return obj[field];
  
  // If it's an object with the specified value field, return that value
  return obj[field][valueField] || `ID: ${obj[field][idField] || 'Unknown'}`;
};

// Validate if an input is a valid number
export const isValidNumber = (value, min, max) => {
  const num = Number(value);
  if (isNaN(num)) return false;
  if (min !== undefined && num < min) return false;
  if (max !== undefined && num > max) return false;
  return true;
};

// Parse a server error message
export const parseErrorMessage = (error) => {
  if (!error) return 'An unknown error occurred';
  
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error.message) {
    return error.message;
  }
  
  return String(error);
};

// Get semester text from a numeric value (1-8)
export const getSemesterText = (semesterNum) => {
  const semesterNames = [
    'Semester 1', 'Semester 2', 'Semester 3', 'Semester 4',
    'Semester 5', 'Semester 6', 'Semester 7', 'Semester 8'
  ];
  
  const index = Number(semesterNum) - 1;
  if (index >= 0 && index < semesterNames.length) {
    return semesterNames[index];
  }
  
  return `Semester ${semesterNum}`;
};
