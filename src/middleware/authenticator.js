import jwt from "jsonwebtoken";

/**
 * Authenticator middleware: reads Bearer token from Authorization header,
 * verifies JWT, and attaches req.user = { userId, email }.
 * Returns 401 if token is missing or invalid.
 */
export const authenticator = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authentication required. Please log in." });
  }

  const token = authHeader.replace("Bearer ", "").trim();

  if (!token) {
    return res.status(401).json({ message: "Authentication required. Please log in." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
    };
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Session expired. Please log in again." });
    }
    return res.status(401).json({ message: "Invalid or expired token. Please log in." });
  }
};
