const Joi = require("@hapi/joi");

const registerValidation = (data) => {
    const schema = Joi.object(
        {
          name: Joi.string().max(255).required(),
          email: Joi.string().max(255).required().email(),
          password: Joi.string().min(8).max(255).required(),
        }
      )

    return schema.validate(data)
}

const loginValidation = (data) => {
    const schema = Joi.object(
        {
          email: Joi.string().max(255).required().email(),
          password: Joi.string().min(8).max(255).required(),
        }
      )

    return schema.validate(data)
}

module.exports.registerValidation = registerValidation
module.exports.loginValidation = loginValidation

