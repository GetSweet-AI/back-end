import User from "../model/User.js";
import { StatusCodes } from "http-status-codes";
import { badRequestError, notFoundError, UnAuthenticatedError } from "../errors/index.js";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import stripeInit from 'stripe';
import { OAuth2Client } from "google-auth-library";

import dotenv from "dotenv";
import DeletedUser from "../model/DeletedUser.js";
import SubscribedUser from "../model/SubscribedUser.js";
dotenv.config(); 



const stripe = stripeInit(process.env.STRIPE_SECRET_KEY);


const register = async (req, res) => {
  const { fullName, email, password, company,role } = req.body;
  if (!fullName || !email || !password || !company ) {
    throw new badRequestError("Please provide all values");
  }

  const userAlreadyExists = await User.findOne({ email });
  if (userAlreadyExists) {
    throw new badRequestError("Email already in use");
  }
  let customer;
  // Check if the customer exists
  const customers = await stripe.customers.list({ email: email, limit: 1 });
  if(customers.data.length>0){
  customer = customers.data[0]
  }else{
    customer = await stripe.customers.create({
      name: fullName,
      email: email,
      description: 'New Customer'
    });
  }

  const userAlreadySignedIn = await DeletedUser.findOne({ email });
  let user;
  if(userAlreadySignedIn){
      user = await User.create({ fullName, email, password,company,role,customerId:customer.id,availableTokens:0 });
  }else{
    user = await User.create({ fullName, email, password,company,role,customerId:customer.id });
  }
  //try and cash should be implemented (but we use instead expr-async-err)
   

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
  res.status(StatusCodes.OK).json({ user, token });
};

const updateEmail = async (req, res) => {
  try {
    const {email } = req.body;
    const { userId } = req.params;

    // check if the email do not exist in db
    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) {
      return res.status(400).json({ error: 'Email already in use' });
    }
    // Update user information
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { $set: { email} },
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

const updateNotificationMessage = async (req, res) => {
  try {
    const { userId } = req.params;
    const {notificationMessage} = req.body;
    // Update user information
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { $set: { notificationMessage:notificationMessage} },
      { returnOriginal: false }
    );

    res.status(200).json({ user: updatedUser });
  } catch (error) {
    console.error('Error updating notificationMessage:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateNameAndCompany = async (req, res) => {
  try {
    const { fullName, company } = req.body;
    const { userId } = req.params;

    // Update user information
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { $set: { fullName, company } },
      { returnOriginal: false }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ user: updatedUser });
  } catch (error) {
    console.error('Error updating infos:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateAvailableTokens = async (req, res) => {
  try {
    const { userId } = req.params;

    // Update user information
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { $inc: { availableTokens: 10 } },
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

    //Check if the user is subscribed then delete the subscription before deleting the user

    // Create a DeletedUser document
    // const DelUser = await DeletedUser.findOne({ email: email });
    // if(!DelUser){
    //   await DeletedUser.create({
    //   email: user.email,
    // });
    // }
    

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
const sendWelcomeMessage = async (req, res) => {
  try {
    const { email } = req.body;
    // Check if email is provided
    if (!email) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Email is required' });
    }
    
    // Send the verification code to the user's email
    // Create a transporter
    const transporter = nodemailer.createTransport({
      service:'gmail',
      auth: {
        user: 'sales@getsweet.ai',
        pass: 'bripwwstustvdiei',
      },
    });


    const mailOptions = {
      from: 'sales@getsweet.ai',
      to: email,
      subject: 'You GetSweet.AI Account has been created ',
      html: `
      <div style="background-color: #f2f2f2; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
          <h1 style="text-align: center; color: #333; font-size: 24px; margin-bottom: 20px;">Welcome to GetSweet AI!</h1>
          
          <p style="font-size: 16px; line-height: 1.5; color: #555;">Hello there,</p>
          <p style="font-size: 16px; line-height: 1.5; color: #555;">We are excited to inform you that your GetSweet AI account has been successfully created.</p>
          
          <p style="font-size: 16px; line-height: 1.5; color: #555;">As a welcome bonus, you've earned 3 free tokens that you can use to generate posts on our platform.</p>
          
          <a   href="https://app.getsweet.ai/brand-engagement-builder" style="font-size: 16px; line-height: 1.5; color: #555;">You can start generating posts today and share your ideas with the world!</a>
          
          <p style="font-size: 14px; line-height: 1.2; color: #888; margin-top: 40px; text-align: center;">This email was sent by the GetSweet AI Team.</p>
      </div>
  </div>
    `,
    };

    await transporter.sendMail(mailOptions);
    // console.log('after 2');
    res.status(StatusCodes.OK).json({ message: 'Welcome message was sent' });
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

    console.log("user :"+JSON.stringify(user))
    // Exclude sensitive data like password before sending the response
    user.password = undefined;
    // if(user?.subscriptionId){
    //   await stripe.subscriptions.cancel(subscriptionId)
    // }

    res.status(StatusCodes.OK).json({ user });
  } catch (error) {
    console.error("Error retrieving user by ID:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
  }
};



// handles google login
const clientId = new OAuth2Client("181452812828-uslduiqspmak4k0red5o3he2qphqa234.apps.googleusercontent.com");
//  const authenticateUser = (req, res) => {
//   const { idToken } = req.body;

//   client
//     .verifyIdToken({ idToken, audience: "181452812828-uslduiqspmak4k0red5o3he2qphqa234.apps.googleusercontent.com" })
//     .then((response) => {
//       const { email_verified, name, email } = response.payload;

//       if (email_verified) {
//         User.findOne({ email }).exec((err, user) => {
//           if (user) {
//             // const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
//             //   expiresIn: "7d"
//             // });
//             const { _id, email, name } = user;
//             return res.json({
//               // token,
//               user: { _id, email, name }
//             });
//           } else {
//             const password = email ;

//             user = new User({ name, email, password });
//             user
//               .save((err, data) => {
//                 if (err) {
//                   return res.status(400).json({
//                     error: "User signup failed with google"
//                   });
//                 }
//                 // const token = jwt.sign(
//                 //   { _id: data._id },
//                 //   // process.env.JWT_SECRET,
//                 //   { expiresIn: "7d" }
//                 // );
//                 const { _id, email, name } = data;

//                 return res.json({
//                   // token,
//                   user: { _id, email, name }
//                 });
//               })
//               .catch((err) => {
//                 return res.status(401).json({
//                   message: "signup error"
//                 });
//               });
//           }
//         });
//       } else {
//         return res.status(400).json({
//           error: "Google login failed. Try again"
//         });
//       }
//     });
// };

const authenticateUser = async (req, res) => {
  const { idToken } = req.body;
   console.log("idToken : " + idToken)
  if (idToken) {

    clientId.verifyIdToken({ idToken, audience: "181452812828-uslduiqspmak4k0red5o3he2qphqa234.apps.googleusercontent.com" })
   
          .then(async response => {
              // console.log(response)
              const { email_verified, email, name, picture } = response.payload
              if (email_verified) {
                console.log(JSON.stringify(response.payload))
                console.log("Two")
                const user = await User.findOne({ email });
                if (user) {
                  // user.json({})
                  // window.location.href = "http://localhost:5173/brand-engagement-builder"
                  // return response?.json(data?.user)
                  // return response
                  // console.log(json({
                  //   user
                  // }))
                  res.status(StatusCodes.CREATED).json({
                    user
                  });
                } else {
                  let customer;
                // Check if the customer exists
                const customers = await stripe.customers.list({ email: email, limit: 1 });
                if(customers.data.length>0){
                customer = customers.data[0]
                }else{
                  customer = await stripe.customers.create({
                    name: name,
                    email: email,
                    description: 'New Customer'
                  }); 
                  //try and cash should be implemented (but we use instead expr-async-err)
                 
                }
                let password = email + clientId
                
                const userAlreadySignedIn = await DeletedUser.findOne({ email });
                let user;
                if(userAlreadySignedIn){
                    user = await User.create({email,password, fullName:name,picture,customerId:customer.id,isEmailConfirmed:true,signUpMode:"Google",availableTokens:0 });
                }else{
                  user = await User.create({email,password, fullName:name,picture,customerId:customer.id,isEmailConfirmed:true,signUpMode:"Google" });
                }
                
                // await User.create({email,password, fullName:name,picture,customerId:customer.id,isEmailConfirmed:true,signUpMode:"Google" });
                res.status(StatusCodes.CREATED).json({
                  user,
                });
                }

              //SignUp user if not exist else SignIn
              //Handle email not verified
                
                  // User.findOne({ email }).exec((err, user) => {
                  //     if(user){
                  //         return res?.json(user)
                  //     }
                  //     else{
                  //         let password = email + clientId
                  //         let newUser = new User({email,name,picture,password});
                  //         newUser.save((err,data)=>{
                  //             if(err){
                  //                 return res.status.json({error:"mongodb error"})
                  //             }
                  //             res.json(data)
                  //         })
                  //     }
                  // })
                  // registerUser({email, name, picture})
              }
          })
          .catch(err => { console.log(err) })
  }
  console.log("33")
};

const subscribeToNewsLetter = async (req, res) => {
  const {email} = req.body;
  if (!email  ) {
    throw new badRequestError("Please provide your email");
  }

  const userAlreadyExists = await SubscribedUser.findOne({ email });
  if (userAlreadyExists) {
    throw new badRequestError("Email already in use");
  }

   let user = await SubscribedUser.create({ email });
  
  //try and cash should be implemented (but we use instead expr-async-err)

  res.status(StatusCodes.CREATED).json({
    user,
  });
};

const confirmUserEmail = async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if the user with the provided userId exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: "User not found" });
    }

    // Switch the user role
    const newUser = await User.findByIdAndUpdate(
      userId,
      { $set: { isEmailConfirmed: true } },
      { new: true }
    );

    // Send the welcome email
    try {
      const { email, fullName } = user;
      // Check if email is provided
      if (!email) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Email is required' });
      }

      // Send the verification code to the user's email
      // Create a transporter
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
        subject: 'Your GetSweet.AI Account has been created',
        html: `
        <div style="background-color: #f2f2f2; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
            <h1 style="text-align: center; color: #333; font-size: 24px; margin-bottom: 20px;">Welcome to GetSweet AI!</h1>
            
            <p style="font-size: 16px; line-height: 1.5; color: #555;">Hello ${fullName},</p>
            <p style="font-size: 16px; line-height: 1.5; color: #555;">We are excited to inform you that your GetSweet AI account has been successfully created.</p>
            
            <p style="font-size: 16px; line-height: 1.5; color: #555;">As a welcome bonus, you've earned 3 free tokens that you can use to generate posts on our platform.</p>
            
            <a href="https://app.getsweet.ai/brand-engagement-builder" style="font-size: 16px; line-height: 1.5; color: #555;">You can start generating posts today and share your ideas with the world!</a>
            
            <p style="font-size: 14px; line-height: 1.2; color: #888; margin-top: 40px; text-align: center;">This email was sent by the GetSweet AI Team.</p>
        </div>
        </div>
      `,
      };

      await transporter.sendMail(mailOptions);
      res.status(StatusCodes.OK).json({ message: 'User confirmed successfully', newUser });
    } catch (error) {
      // Handle error related to sending the email
      console.error('Error sending welcome email:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
  } catch (error) {
    // Handle error related to user lookup or update
    console.error('Error confirming user:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
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
    const verificationLink = `http://app.getsweet.ai/confirm-email/${userId}`;

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


export { updateNotificationMessage,updateNameAndCompany,subscribeToNewsLetter,sendWelcomeMessage,authenticateUser,register, login, updateEmail,sendVerificationCode,verifyEmail, resetPassword,deleteUser,getUserById,confirmUserEmail,sendEmailVerification,updateAvailableTokens };









