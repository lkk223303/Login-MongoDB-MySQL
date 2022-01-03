// Validation
const Joi = require("@hapi/joi");

// Register Validation
const registerValidation = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(6).required(),
    password: Joi.string().min(6).required(),
  });

  return schema.validate(data);
};
// Login Validation
const loginValidation = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(6).required(),
    // email: Joi.string().email({ tlds: { allow: false } }),
    password: Joi.string().min(6).required(),
  });

  return schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
