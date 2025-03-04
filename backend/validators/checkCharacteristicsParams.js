const { param } = require("express-validator");
const { getCharacteristicsById } = require("../models/characteristicsModel");
const { getUserByid } = require("../models/userModel");


exports.checkCharacteristicUser = [
    param("id").custom(async (id, { req }) => {
      try {
        const user = await getUserByid(req.user?.id);
  
        if (user?.role !== "admin") {
          const recipe = await getCharacteristicsById(id);
          if (recipe?.user_id !== req.user?.id) {
            throw new Error("Error editing characteristic");
          }
        }
  
        return true;
      } catch (error) {
        throw new Error(error.message);
      }
    }),
  ];