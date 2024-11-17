import "reflect-metadata";
import express from "express";
import { PostgresDataSource } from "./dbConfig";

const app = express();
const PORT = 3000;

PostgresDataSource.initialize()
  .then(() => {
    console.log("Database connected successfully!");

    app.get("/", (req, res) => {
      console.log("FIXED");
      res.send("Hello, Office Attendance APIIIIIIIIIIIII!");
    });

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error during database initialization:", error);
  });
