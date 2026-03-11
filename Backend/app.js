import { connectDB } from "./src/config/db.js";
import express from "express";
import cors from "cors";
import path from "path";
import authRoutes from "./src/routes/auth.js";
import medecinRoutes from "./src/routes/medecin.js";
import patientRoutes from "./src/routes/patient.js";
import adminRoutes from "./src/routes/admin.js";
import consultationRoutes from "./src/routes/consultation.js";
import dotenv from "dotenv";
dotenv.config();

await connectDB();
const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/medecin", medecinRoutes);
app.use("/api/patient", patientRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/consultations", consultationRoutes);
export default app; 
