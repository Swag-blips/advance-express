import joi from "joi";

const validateRegistration = (data) => {
  const schema = joi.object({
    username: joi.string().min(3).max(50).required(),
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
  });

  return schema.validate(data);
};

const validateLogin = (data) => {
  const schema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
  });

  return schema.validate(data);
};

export { validateRegistration, validateLogin };
