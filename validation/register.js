const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateRegisterInput(data) {
  let errors = {};

  // Convert empty fields to an empty string so we can use validator functions
  data.name = !isEmpty(data.name) ? data.name : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.confirmPassword = !isEmpty(data.confirmPassword) ? data.confirmPassword : "";

  // Name checks
  if (Validator.isEmpty(data.name)) {
    errors.name = "Name Field is required";
  }

  // Email checks
  if (Validator.isEmpty(data.email)) {
    errors.email = "Email Field is required";
  } else if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }

  // Password checks
  if (Validator.isEmpty(data.password)) {
    errors.password = "Password Field is required";
  }

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
