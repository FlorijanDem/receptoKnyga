const { params } = require("express-validator");

exports.checkRecipeParams = [
    params("id").isInt({ min: 1 }).withMessage("Invalid recipe ID"),
];