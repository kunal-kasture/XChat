const User = require("../models/User");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "fallback_secret", {
    expiresIn: "7d",
  });
};

const registerUser = async (req, res) => {
  try {
    const { fullName, username, email, password } = req.body;

    if (!fullName || !username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const emailExists = await User.findOne({ email: email.toLowerCase() });
    if (emailExists) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered",
      });
    }

    const usernameExists = await User.findOne({
      username: username.toLowerCase(),
    });
    if (usernameExists) {
      return res.status(409).json({
        success: false,
        message: "Username is already taken",
      });
    }

    const avatarUrl = `https://avatar.iran.liara.run/username?username=${encodeURIComponent(
      fullName,
    )}`;

    const user = await User.create({
      fullName,
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password,
      avatar: avatarUrl,
    });

    return res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      },
      message: "User created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while registering the user",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User does not exist with this email",
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    const accessToken = generateToken(user._id);

    const isSecure =
      req.secure ||
      req.headers["x-forwarded-proto"] === "https" ||
      process.env.NODE_ENV === "production";

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: isSecure,
      sameSite: isSecure ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      data: {
        user: {
          _id: user._id,
          fullName: user.fullName,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
        },
        accessToken,
      },
      message: "User logged in successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong during login",
    });
  }
};

const logoutUser = async (req, res) => {
  try {
    const isSecure =
      req.secure ||
      req.headers["x-forwarded-proto"] === "https" ||
      process.env.NODE_ENV === "production";

    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: isSecure,
      sameSite: isSecure ? "none" : "lax",
    });
    return res.status(200).json({
      success: true,
      message: "User logged out",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error during logout process",
    });
  }
};

const getMyProfile = async (req, res) => {
  return res.status(200).json({
    success: true,
    data: {
      _id: req.user._id,
      fullName: req.user.fullName,
      username: req.user.username,
      email: req.user.email,
      avatar: req.user.avatar,
    },
    message: "User fetched successfully",
  });
};

const searchUsers = async (req, res) => {
  try {
    const { searchTerm } = req.query;

    if (!searchTerm || searchTerm.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Search term is required",
      });
    }

    const cleanTerm = searchTerm.trim();

    const users = await User.find({
      $or: [
        { username: { $regex: cleanTerm, $options: "i" } },
        { email: { $regex: cleanTerm, $options: "i" } },
        { fullName: { $regex: cleanTerm, $options: "i" } },
      ],
    }).select("_id fullName username email avatar");

    return res.status(200).json({
      success: true,
      data: users,
      message: "Users fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching users",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getMyProfile,
  searchUsers,
};
