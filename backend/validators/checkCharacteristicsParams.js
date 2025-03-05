const { param } = require("express-validator");
const { getUserByid } = require("../models/userModel");

exports.checkCharacteristicAdmin = [
  param("id").custom(async (id, { req }) => {
    try {
      const user = await getUserByid(req.user?.id);

      if (user?.role !== "admin") {
        throw new Error("Error geting characteristics");
      }

      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  }),
];




