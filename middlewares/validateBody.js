const { HttpError } = require("../helpers");

const validationBody = (schema) => {
  const validation = (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      console.log("error: ", error.details[0].message);
      if (!error.details) {
        next(HttpError(400, error.message));
      } else {
        res.status(400).json({ message: error.details[0].message });
      }
    }
    next();
  };

  return validation;
};

module.exports = validationBody;
