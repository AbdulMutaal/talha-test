const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateChangePasswordInput(data) {
  let errors = {};
  data.password = !isEmpty(data.password) ? data.password : "";
  data.confirmPassword = !isEmpty(data.confirmPassword) ? data.confirmPassword : "";
 
  if (Validator.isEmpty(data.confirmPassword)) {
    errors.message = "Confirm Password field is required";
  }
  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.message = "Password must be at least 6 characters in Length";
  }
  if (!Validator.equals(data.password, data.confirmPassword)) {
    errors.message = "Passwords Did Not Match, Please enter the Same Password ";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
