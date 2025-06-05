import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  let token;

  if (authHeader) token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      status: "Error",
      message: "Token tidak ada",
    });
  }

  jwt.verify(
    token, 
    process.env.ACCESS_TOKEN_SECRET, 
    (error, decoded) => {
      if (error) {
        return res.status(403).json({
          status: "Error",
          message: "Access token tidak valid",
        });
      }
      req.email = decoded.email;
      next();
    }
  );
};