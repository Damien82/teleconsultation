import { User } from "../models/User.js";// <-- utilisation d'import + .js
import jwt from "jsonwebtoken";

// Génération JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

// Login
export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if(user && await user.matchPassword(password)){
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    });
  } else {
    res.status(401).json({ message: "Email ou mot de passe incorrect" });
  }
};

// Register (patient seulement)
export const register = async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });
  if(userExists) return res.status(400).json({ message: "Email déjà utilisé" });

  const user = await User.create({ name, email, password });
  if(user){
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    });
  } else {
    res.status(400).json({ message: "Erreur lors de l'inscription" });
  }
};
