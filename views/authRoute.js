import express from "express";
import {
  Login,
  Signup,
  ForgetPassword,
  ResetPassword,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", Signup);
router.post("/login", Login);
router.post("/forget-password", ForgetPassword);
router.post("/reset-password/:id/:token", ResetPassword);

export default router;
