import "reflect-metadata";
import express from "express";
import { PostgresDataSource } from "./dbConfig";
import authRoutes from "./Routes/AuthRoutes"; // Adjust the path based on your project structure
import attendanceRoutes from "./Routes/AttendanceRoutes";
import officeRoutes from "./Routes/OfficeRoutes";
import userRoutes from "./Routes/UserRoutes";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

PostgresDataSource.initialize()
  .then(async () => {
    console.log("Database connected successfully!");

    app.get("/", (req, res) => {
      res.send("Hello, Office Attendance APIIIIIIIIIIIII!");
    });

    app.use("/auth", authRoutes);
    app.use("/api/attendances", attendanceRoutes);
    app.use("/api/offices", officeRoutes);
    app.use("/users", userRoutes);

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
