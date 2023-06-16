import User from "../model/User.js";
import { StatusCodes } from "http-status-codes";
import { badRequestError, notFoundError, UnAuthenticatedError } from "../errors/index.js";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";

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
  const userData = await User.findOne({ email });

  if (!user) {
    throw new UnAuthenticatedError("Invalid Credentials");
  }

  if (!userData.isEmailConfirmed) {
    throw new UnAuthenticatedError("Email not confirmed. Please verify your email.");
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
  try {
    const { fullName, email, company } = req.body;
    const { userId } = req.params;

    // check if the email do not exist in db
    // const userAlreadyExists = await User.findOne({ email });
    // if (userAlreadyExists) {
    //   return res.status(400).json({ error: 'Email already in use' });
    // }
    // Update user information
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { $set: { fullName, email, company } },
      { returnOriginal: false }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ user: updatedUser });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if the user exists
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Delete user
    const deletedUser = await User.findOneAndDelete({ _id: userId });

    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Error deleting user' });
  }
};

const generateVerificationCode = () => {
  const code = Math.floor(1000 + Math.random() * 9000); // Generate a random 4-digit number
  return code.toString(); // Convert the number to a string
};

const sendVerificationCode = async (req, res) => {
  try {
    const verificationCode = generateVerificationCode(); // Your code to generate a random verification code
    const { email } = req.body;
    // Check if email is provided
    if (!email) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Email is required' });
    }

    // Save the verification code in the database associated with the user's email
// Update the user in the database with the verification code
    const user = await User.findOneAndUpdate(
      { email },
      { verificationCode },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // Send the verification code to the user's email
    console.log('before');
    // Create a transporter
    const transporter = nodemailer.createTransport({
      service:'gmail',
      auth: {
        user: 'sales@getsweet.ai',
        pass: 'bripwwstustvdiei',
      },
    });
    console.log('after');


    const mailOptions = {
      from: 'sales@getsweet.ai',
      to: email,
      subject: 'Password Reset Verification',
      html: `
      <div style="background-color: #f2f2f2; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
          <h1 style="text-align: center; color: #333; font-size: 24px; margin-bottom: 20px;">Password Reset Verification</h1>
          <p style="font-size: 16px; line-height: 1.5; color: #555;">Thank you for using our service. To reset your password, please enter the verification code below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <h2 style="font-size: 32px; color: #007bff; margin: 0;">${verificationCode}</h2>
          </div>
          <p style="font-size: 16px; line-height: 1.5; color: #555;">If you did not request a password reset, please ignore this email.</p>
          <p style="font-size: 14px; line-height: 1.2; color: #888; margin-top: 40px; text-align: center;">This email was sent by the GetSweet.AI Team.</p>
        </div>
      </div>
    `,
    };

    await transporter.sendMail(mailOptions);
    console.log('after 2');
    res.status(StatusCodes.OK).json({ message: 'Verification code sent successfully' });
  } catch (error) {
    // Handle error
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { email, verificationCode } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Compare the verification code
    if (user.verificationCode !== verificationCode) {
      return res.status(400).json({ error: 'Invalid verification code' });
    }

    // Verification successful
    // You can perform additional actions here, such as updating the user's password

    res.status(200).json({ message: 'Email verification successful' });
  } catch (error) {
    console.error('Error verifying email:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    // Check if the user exists by email
    const user = await User.findOne({ email });

    // If user doesn't exist, return an error
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: "User not found" });
    }

    // Generate a hashed password for the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Modify the user's password in the database using findOneAndUpdate
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { new: true }
    );

    // Optionally, you can respond with the updated user object or a success message
    res.status(StatusCodes.OK).json({ message: "Password reset successful", user: updatedUser });
  } catch (error) {
    // Handle error
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
  }
};

const getUserById = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: "User not found" });
    }

    // Exclude sensitive data like password before sending the response
    user.password = undefined;

    res.status(StatusCodes.OK).json({ user });
  } catch (error) {
    console.error("Error retrieving user by ID:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
  }
};

const confirmUserEmail = async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if the user with the provided userId exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: "User not found" });
    }

  //   console.log('before')
    // Switch the user role
   const newUser =  await User.findByIdAndUpdate(
      userId,
      { $set: { isEmailConfirmed: true } },
      { new: true }
    );
  //   console.log('after')
    res.status(StatusCodes.OK).json({ message: "User confirmed successfully", newUser });
  } catch (error) {
    // Handle error
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
  }
};

const sendEmailVerification = async (req, res) => {
  try {
    const { email } = req.body;
    const { userId } = req.params;
    
    // Check if email is provided
    if (!email) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Email is required' });
    }

    // Generate the verification link
    const verificationLink = `https://648cb2a7b32a7903ab4664de--spiffy-gingersnap-b0603f.netlify.app/confirm-email/${userId}`;

    // Send the verification link to the user's email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'sales@getsweet.ai',
        pass: 'bripwwstustvdiei',
      },
    });

    const mailOptions = {
      from: 'sales@getsweet.ai',
      to: email,
      subject: 'Email Confirmation',
      html: `
        <div style="background-color: #f2f2f2; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
            <h1 style="text-align: center; color: #333; font-size: 24px; margin-bottom: 20px;">Email Confirmation</h1>
            <p style="font-size: 16px; line-height: 1.5; color: #555;">Thank you for registering. To confirm your email, please click the following link:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationLink}" style="display: inline-block; background-color: #007bff; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Confirm Email</a>
            </div>
            <p style="font-size: 16px; line-height: 1.5; color: #555;">By clicking the link above, you will confirm your email.</p>
            <p style="font-size: 14px; line-height: 1.2; color: #888; margin-top: 40px; text-align: center;">This email was sent by the GetSweet.AI Team.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(StatusCodes.OK).json({ message: 'Email verification link sent successfully' });
  } catch (error) {
    // Handle error
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
  }
};


export { register, login, updateUser,sendVerificationCode,verifyEmail, resetPassword,deleteUser,getUserById,confirmUserEmail,sendEmailVerification };
