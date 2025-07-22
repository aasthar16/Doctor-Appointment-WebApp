import jwt from "jsonwebtoken";

export const generateToken = (user, message, statusCode, res) => {
  // ✅ Fallback: generate token directly if getJWTToken is not defined
  const token = typeof user.getJWTToken === "function"
    ? user.getJWTToken()
    : jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET_KEY, {
        expiresIn: "5d",
      });

  const options = {
    httpOnly: true,
    expires: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days
  };

  // ✅ Cookie name based on role
  const cookieName =
    user.role === "Admin"
      ? "adminToken"
      : user.role === "Doctor"
      ? "doctorToken"
      : "patientToken";

  res
    .status(statusCode)
    .cookie(cookieName, token, options)
    .json({
      success: true,
      message,
      user,
    });
};
