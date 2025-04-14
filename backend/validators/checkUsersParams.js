const { param } = require("express-validator");
const { getUserByid } = require("../models/userModel");

exports.checkUserParams = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("Invalid user ID")
    .custom(async (id) => {
      try {
        const user = await getUserByid(id);
        if (!user) {
          throw new Error("User not found");
        }

        return true;
      } catch (error) {
        throw new Error(error.message);
      }
    }),
];

exports.checkBanUserParams = [
  param("id").custom(async (id, { req }) => {
    if (!req.body.banned) return true;
    try {
      if (id === req.user?.id) {
        throw new Error("You can't ban yourself");
      }

      const user = await getUserByid(id);
      if (user?.role === "admin") {
        throw new Error("You can't ban an admin");
      }

      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  }),
];
