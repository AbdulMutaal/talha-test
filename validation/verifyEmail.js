const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateEmailVerification(data) {
  let errors = {};
  data.userId = !isEmpty(data.userId) ? data.userId : "";
  
  if (Validator.isEmpty(data.userId)) {
    errors.userId = "User ID is required";
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
