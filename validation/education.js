const Validator = require('validator');
const isEmpty = require('./isEmpty');

module.exports = validateEducationInput = (data) => {
  let errors = {};

  data.school = !isEmpty(data.school) ? data.school : '';
  data.degree = !isEmpty(data.degree) ? data.degree : '';
  data.fieldofstudy = !isEmpty(data.fieldofstudy) ? data.fieldofstudy : '';
  data.from = !isEmpty(data.from) ? data.from : '';

  // Validate school
  if (Validator.isEmpty(data.school)) {
    errors.school = 'School name is required';
  }

  // Validate degree
  if (Validator.isEmpty(data.degree)) {
    errors.degree = 'Degree is required';
  }

  // Validate fieldofstudy
  if (Validator.isEmpty(data.fieldofstudy)) {
    errors.fieldofstudy = 'Field of study is required';
  }

  // Validate from date
  if (Validator.isEmpty(data.from)) {
    errors.from = 'From date is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
