import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/teleconsultation";

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);

    console.log("MongoDB connecté");
  } catch (err) {
    console.error("Erreur de connexion MongoDB:", err);
    process.exit(1);
  }
};
