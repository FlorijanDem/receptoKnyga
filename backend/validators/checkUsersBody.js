const { body } = require("express-validator");

exports.checkUpdateUserBody = [
  body("banned")
    .optional()
    .isBoolean()
    .custom((value, { req }) => {
      if (req.user?.role !== "admin") {
        throw new Error("You are not admin");
      }

      return true;
    }),
];
