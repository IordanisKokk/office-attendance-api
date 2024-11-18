import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
import { Attendances } from "./entities/Attendances";
import { Office } from "./entities/Office";
import { User } from "./entities/User";

dotenv.config();

export const PostgresDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true, // Set to false in production
  logging: false,
  entities: [
    User,
    Office, 
    Attendances
  ],
});
