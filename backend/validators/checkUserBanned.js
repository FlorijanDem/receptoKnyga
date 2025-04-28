const { body } = require("express-validator");

exports.checkUserBanned = [
  body().custom((value, { req }) => {
    if (req.user?.banned) {
      throw new Error("User is banned");
    }

    return true;
  }),
];
