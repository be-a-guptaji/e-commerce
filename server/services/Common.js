import passport from "passport";

export const isAuthenticated = (req, res, done) => {
  return passport.authenticate("jwt");
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

export const cookiesExtractor = (req, res) => {
  let token = null;

  if (req && req.cookies) {
    token = req.cookies["jwt"];
  }
  return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiYWRtaW4iLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsInJvbGUiOiJhZG1pbiIsImFkZHJlc3NlcyI6W10sImlkIjoiNjc1NWVkMWJjMTcwOTAzNmQzNzNjNjE0IiwiaWF0IjoxNzM0MDg0NzEyfQ.qBlAxPBO0woTabQkQWpcJVoDA19sYsJdX9oR7VljyeU";
  return token;
};
