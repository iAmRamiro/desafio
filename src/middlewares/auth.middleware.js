/* export const authMiddleware = (req, res, next) => {
  try {
    const { user } = req;
    if (user.email === "coderhouse@mail.com") {
      next();
    } else {
      res.send("Not Authorized");
    }
  } catch (error) {}
}; */

/* export const authMiddleware = (role) => {
  return (req, res, next) => {
    if (req.user.role != role) {
      res.status(403).json({ message: "NOT AUTHORIZED" });
      next();
    }
  };
};
 */

export const authMiddleware = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      res.status(403).json({ message: "NOT AUTHORIZED" });
      next();
    }
  };
};
