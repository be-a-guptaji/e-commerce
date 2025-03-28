import jwt from "jsonwebtoken";

export const cookiesExtractor = (req, res) => {
  let token = null;

  if (req && req.cookies) {
    token = req.cookies["jwt"];
  }

  return token;
};

export const isAuthenticated = (req, res, next) => {
  try {
    const token = cookiesExtractor(req, res);

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (decoded) {
        req.user = decoded;
      }
    });

    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const sanitizeUser = (user) => {
  const userObject = user.toObject();

  const id = userObject._id;
  userObject.id = id;

  if (!userObject.addresses) {
    userObject["addresses"] = [];
  }

  delete userObject.password;
  delete userObject.salt;
  delete userObject._id;
  delete userObject.__v;
  delete userObject.createdAt;
  delete userObject.updatedAt;

  return userObject;
};
