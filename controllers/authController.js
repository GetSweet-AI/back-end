import User from "../model/User.js";
import { StatusCodes } from "http-status-codes";
import { badRequestError, UnAuthenticatedError } from "../errors/index.js";

const register = async (req, res) => {
  const { fullName, email, password, company } = req.body;
  if (!fullName || !email || !password || !company ) {
    throw new badRequestError("Please provide all values");
  }

  const userAlreadyExists = await User.findOne({ email });
  if (userAlreadyExists) {
    throw new badRequestError("Email already in use");
  }

  //try and cash should be implemented (but we use instead expr-async-err)
  const user = await User.create({ fullName, email, password,company });
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({
    user: {
      email: user.email,
      fullName: user.fullName,
      company: user.name,
    },
    token,
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

export { register, login, updateUser };
