import jwt from "jsonwebtoken"; 

const generateRefreshToken = (userId) => {
  const token = jwt.sign(
    { id: userId },
    process.env.SECRET_KEY_REFRESH_TOKEN,
    { expiresIn: "7d" } 
  );

  return token;
};

export default generateRefreshToken;
