import { body } from "express-validator";
import { EMAIL_REQ, INVALID_EMAIL, PHONE_REQ, PHONE_REQ_CHARS, PSWD_REQ, PSWD_REQ_CHARS, USERNAME_REQ, USERNAME_REQ_CHARS } from "../utils/translations";

export const usernameValidator = [
  body("username")
    .notEmpty()
    .withMessage(USERNAME_REQ)
    .matches(/^[A-Za-z][A-Za-z0-9_]{2,32}$/)
    .withMessage(USERNAME_REQ_CHARS),
];

export const emailValidator = body("email")
  .notEmpty()
  .withMessage(EMAIL_REQ)
  .isEmail()
  .withMessage(INVALID_EMAIL);

export const passwordValidator = [
  body("password")
    .notEmpty()
    .withMessage(PSWD_REQ)
    .matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,20}$/)
    .withMessage(PSWD_REQ_CHARS)
];

export const confirmPasswordValidator = [
  body(["resetPassword", "resetConfirmPassword"])
    .notEmpty()
    .withMessage(PSWD_REQ)
    .matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,20}$/)
    .withMessage(PSWD_REQ_CHARS)
];

export const phoneNumberValidator = [
  body("phone")
    .notEmpty()
    .withMessage(PHONE_REQ)
    .matches(/^\+[1-9]{1}[0-9]{3,14}$/)
    .withMessage(PHONE_REQ_CHARS),
];
