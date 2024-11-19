import "reflect-metadata";
import express from "express";
import { PostgresDataSource } from "./dbConfig";
import authRoutes from './Routes/AuthRoutes'; // Adjust the path based on your project structure
import attendanceRoutes from "./Routes/AttendanceRoutes";
import { Attendances } from "./Entities/Attendances";
import { Office } from "./Entities/Office";
import { User } from "./Entities/User";
import { Role } from "./Interfaces/Role";

const app = express();
const PORT = 3000;

app.use(express.json()); // Parse JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded requests

PostgresDataSource.initialize()
  .then(async () => {
    console.log("Database connected successfully!");

    app.get("/", (req, res) => {
      res.send("Hello, Office Attendance APIIIIIIIIIIIII!");
    });

    app.use("/auth", authRoutes);
    app.use("/api/attendances", attendanceRoutes);

    app.use((req, res) => {
      res.status(404).json({ error: "Route not found" });
    });

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error during database initialization:", error);
  });
