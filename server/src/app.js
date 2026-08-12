import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import errorMiddleware from "./middleware/errorMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test Route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Lead CRM API is running 🚀"
    });
});

app.use("/api/v1/auth", (req, res, next) => {
    console.log("🔥 AUTH ROUTE HIT:", req.method, req.originalUrl);
    next();
});

app.use("/api/v1/auth", authRoutes);
// app.use("api/v1/auth", authRoutes);

app.use(errorMiddleware);



export default app;