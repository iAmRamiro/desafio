import jwt from "jsonwebtoken";

const SECRET_KEY_JWT = "secretJWT";

/* export const jwtValidation = (req, res, next) => {
  try {
    const authHeader = req.get("Authorization");

    const token = authHeader.split(" ")[1];
    console.log("user", req.user);
    //decodificar
    const userToken = jwt.verify(token, SECRET_KEY_JWT);
    req.user = userToken;
    next();
  } catch (error) {
    res.json({ error: error.message });
  }
};
 */

export const jwtValidation = (req, res, next) => {
  try {
    const token = req.cookies.token;

    //decodificar
    const userToken = jwt.verify(token, SECRET_KEY_JWT);
    req.user = userToken;
    next();
  } catch (error) {
    res.json({ error: error.message });
  }
};
