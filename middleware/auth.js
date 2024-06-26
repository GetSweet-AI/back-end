import jwt from "jsonwebtoken";
import { UnAuthenticatedError } from "../errors/index.js";

const auth = async (req, res, next) => {
  console.log("Authentication Middleware - Before");
  const authHeader = req.headers.authorization;
  console.log("Authorization Header:", authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new UnAuthenticatedError("Authentication Invalid");
  }

  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, "y/B?E(H+MbPeShVmYq3t6w9z$C&F)J@N");
    // console.log("Decoded Payload:", payload);
    req.user = { userId: payload.userId };
    // console.log("User ID:", req.user.userId);
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      // console.error("Authentication Error: Token Expired");
      // Handle the token expiration error here
      // For example, you can return an HTTP 401 Unauthorized response
      res.status(401).json({ error: "Token expired" });
    } else {
      console.error("Authentication Error:", error);
      throw new UnAuthenticatedError("Authentication Invalid");
    }
  }
};

export default auth;
