const { body } = require("express-validator");

exports.checkConsumedBody = [
  body("recipeTitle")
    .trim()
    .notEmpty()
    .withMessage("Recipe title is required"),

  body("datetime")
    .notEmpty()
    .withMessage("Datetime is required")
    .matches(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)
    .withMessage("Invalid datetime format (expected: YYYY-MM-DD HH:mm:ss)")
    .bail()
    .custom((value) => {
      const date = new Date(value.replace(" ", "T"));
      if (isNaN(date.getTime())) {
        throw new Error("Invalid datetime value");
      }

      const [datePart, timePart] = value.split(" ");
      const [year, month, day] = datePart.split("-").map(Number);
      const [hour, minute, second] = timePart.split(":").map(Number);

      if (
        year < 2024 ||
        year > 2100 ||
        month < 1 ||
        month > 12 ||
        day < 1 ||
        day > 31 ||
        hour > 23 ||
        minute > 59 ||
        second > 59
      ) {
        throw new Error("Datetime components out of valid range");
      }

      return true;
    }),
    
];
