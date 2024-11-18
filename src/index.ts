import "reflect-metadata";
import express from "express";
import { PostgresDataSource } from "./dbConfig";
import { Attendances } from "./entities/Attendances";
import { Office } from "./entities/Office";
import { User } from "./entities/User";
import { Role } from "./Interfaces/Role";
import test from "node:test";

const app = express();
const PORT = 3000;

PostgresDataSource.initialize()
  .then(async () => {
    console.log("Database connected successfully!");

    app.get("/", (req, res) => {
      res.send("Hello, Office Attendance APIIIIIIIIIIIII!");
    });

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error during database initialization:", error);
  });
