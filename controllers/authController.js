import User from "../models/userSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const Signup = async (req, res) => {
  const { name, email, password } = req.body;

  // Check if the user already exists
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    // Hash the password

    const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new user

    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    // Send a success response

    res
      .status(201)
      .json({ message: "User registered successfully", data: user });
    // Log the error
  } catch (error) {
    // Send an error response
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const Login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    res.status(200).json({ message: "Login Successfull", token: token, role: user.role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const ForgetPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Uses not found" });
    }
    // Generate a reset token
    const resetToken = jwt.sign({_id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    // Send the reset token to the user
    res.status(200).json({message: "Reset Password Successfull", token: resetToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message:  "Internal server error" });
  }
};

export const ResetPassword = async (req, res) => {
  const { resetToken, newPassword } = req.body;
  try {
    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
