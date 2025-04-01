const { body } = require("express-validator");

exports.validateResetPassword = [
    body('newPassword')
        .trim()
        .notEmpty()
        .withMessage('New password is required')
        .isString()
        .withMessage("New password must be string")
        .isLength({ min: 8 })
        .withMessage("New Password must be at least 8 characters long")
        .isLength({ max: 20 })
        .withMessage("New password must have a maximum of 20 characters")
        .matches(/[A-Z]/)
        .withMessage("New password must include at least 1 uppercase letter")
        .matches(/[a-z]/)
        .withMessage("New password must include at least 1 lowercase letter")
        .matches(/[0-9]/)
        .withMessage("New Password must include at least 1 number")
        .matches(/[\W_]/)
        .withMessage("New password must include at least 1 special character"),

    body('confirmNewPassword')
        .custom((value, { req }) => {
            if (value !== req.body['newPassword']) {
                throw new Error("Passwords do not match");
            }
            return true;
        }),
]
