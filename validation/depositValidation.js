const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateDeposit(data) {
  let errors = {};

  // Convert empty fields to an empty string so we can use validator functions
  data.userId= !isEmpty(data.userId) ? data.userId : "";
  data.amount = !isEmpty(data.amount) ? data.amount : "";
  data.currencyId =  !isEmpty(data.currencyId) ? data.currencyId : "";

  if (Validator.isEmpty(data.userId)) {
    errors.password = "Missing User ID";
  }
  if (Validator.isEmpty(data.amount.toString())) {
    errors.password = "Missing Amount";
  }
  if (Validator.isEmpty(data.currencyId.toString())) {
    errors.password = "Missing Currency ID";
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
