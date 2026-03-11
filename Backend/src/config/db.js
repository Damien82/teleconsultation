import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://Mbida:X8K5dOUnzSO6oZdm@iai-vote.ztzszu0.mongodb.net/?appName=iai-vote";

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);

    console.log("MongoDB connecté");
  } catch (err) {
    console.error("Erreur de connexion MongoDB:", err);
    process.exit(1);
  }
};
