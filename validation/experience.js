const Validator = require('validator');
const isEmpty = require('./isEmpty');

module.exports = validateExperienceInput = (data) => {
  let errors = {};

  data.title = !isEmpty(data.title) ? data.title : '';
  data.company = !isEmpty(data.company) ? data.company : '';
  data.from = !isEmpty(data.from) ? data.from : '';

  // Validate title
  if (Validator.isEmpty(data.title)) {
    errors.title = 'Job title is required';
  }

  // Validate company
  if (Validator.isEmpty(data.company)) {
    errors.company = 'Company name is required';
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
