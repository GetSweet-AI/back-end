const authorize = (allowedRoles) => {
    return (req, res, next) => {
      const { role } = req.user;
      if (!allowedRoles.includes(role)) {
        // User does not have the required role
        return res.status(StatusCodes.FORBIDDEN).json({
          error: "Insufficient permissions",
        });
      }
      next();
    };
  };

  export default authorize