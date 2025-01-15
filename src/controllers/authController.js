import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
console.log(jwt);

export const createToken = (user) => {
  const payload = { id: user._id };
  const token = jwt.sign(payload, process.env.jwt_secret, { expiresIn: "20h" });
  return token;
};

export const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const newUser = await User.create({
      name,
      email,
      password,
    });

    const token = createToken(newUser._id);

    return res.status(201).json({
      token,
      data: {
        newUser,
      },
    });
  } catch (err) {
    console.log(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new Error("Please provide email and password!", 400));
    }

    const user = await User.findOne({ email }).select("+password");
    console.log(typeof user.password);
    console.log(typeof bcrypt.hash(password, 12));

    if (
      !bcrypt.compare(
        user.password,
        (await bcrypt.hash(password, 12)).toString()
      )
    ) {
      return next(new Error("Password is not correct "));
    }
    let token = createToken(user);
    return res.status(201).json({
      token,
    });
  } catch (err) {
    console.log(err);
  }
};

export const protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(
        new Error("You are not logged in ! Please log in to get access ", 401)
      );
    }

    const decode = jwt.verify(token, process.env.jwt_secret);
    next();
  } catch (err) {
    console.log(err);
  }
};
