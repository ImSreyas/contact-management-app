import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  // const token = req.headers.authorization?.split(" ")[1];
  const token = req.cookies.accessToken;
  if (!token)
    return res
      .status(403)
      .json({ status: false, message: "No token provided" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ status: false, message: "Invalid token" });
  }
};
