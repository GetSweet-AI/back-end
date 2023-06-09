import User from "../model/User.js";
import { StatusCodes } from "http-status-codes";
import { badRequestError, UnAuthenticatedError } from "../errors/index.js";
import nodemailer from "nodemailer";

const register = async (req, res) => {
  const { fullName, email, password, company,role } = req.body;
  if (!fullName || !email || !password || !company ) {
    throw new badRequestError("Please provide all values");
  }

  const userAlreadyExists = await User.findOne({ email });
  if (userAlreadyExists) {
    throw new badRequestError("Email already in use");
  }

  //try and cash should be implemented (but we use instead expr-async-err)
  const user = await User.create({ fullName, email, password,company,role });
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({
    user,
    token
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new badRequestError("Please provide all values");
  }
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new UnAuthenticatedError("Invalid Credentials");
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnAuthenticatedError("Invalid Credentials");
  }
  const token = user.createJWT();
  user.password = undefined;
  res.status(StatusCodes.OK).json({ user, token, location: user.location });
};

const updateUser = async (req, res) => {
  const {  fullName, email,company } = req.body;
  if (!email || !fullName || !company ) {
    throw new badRequestError("Please provide all values");
  }
  const user = await User.findOne({ _id: req.user.userId });

  // user.lastName = lastName;
  // user.location = location;
  console.log(company);
  console.log(email);
  console.log(fullName);

  const updatedUser = await User.updateOne(
    { _id: req.user.userId },
    { $set: { fullName, email, company } }
  );
  
  console.log("test");
  const token = user.createJWT();


  res.status(StatusCodes.OK).json({ user, token });
};



const sendVerificationCode = async (email) => {
  const verificationCode = generateVerificationCode(); // Your code to generate a random verification code

  // Save the verification code in the database associated with the user's email

  // Send the verification code to the user's email
  const transporter = nodemailer.createTransport({
    // Configure your email provider settings here
  });

  const mailOptions = {
    from: "hzaydi78@gmail.com",
    to: email,
    subject: "Password Reset Verification",
    text: `Your verification code is: ${verificationCode}`,
  };

  await transporter.sendMail(mailOptions);
};




export { register, login, updateUser,sendVerificationCode };
