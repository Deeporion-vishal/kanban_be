import { Router } from "express";
import UserController from "../controllers/user.controller";
import {
  emailValidator,
  passwordValidator,
  usernameValidator,
} from "../middlewares/validators";


const router = Router();

router
  .route("/users/user/sign-up")
  .post(
    emailValidator,
    passwordValidator,
    usernameValidator,
    UserController.signUpUser
  );

router.route("/users/user/sign-in").post(UserController.signInUser);

router.route("users/user/sign-out").post(UserController.signOutUser);

router.route("/users").get(UserController.getAllusers);

router.get("/users/userByUsername/:username", UserController.getUserByName);
router
  .route("/users/user/:id")
  .get(UserController.getUserById)
  .patch(UserController.updateUserById)
  .delete(UserController.deleteUserById);

export default router;
