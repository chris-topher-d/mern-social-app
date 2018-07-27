const Validator = require('validator');
const isEmpty = require('./isEmpty');

module.exports = validatePostInput = (data) => {
  let errors = {};

  data.text = !isEmpty(data.text) ? data.text : '';

  // Validate text length
  if (!Validator.isLength(data.text, { min: 10, max: 300})) {
    errors.text = 'Post must be between 10 and 300 characters';
  }

  // Validate text
  if (Validator.isEmpty(data.text)) {
    errors.text = 'Text field is empty';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
