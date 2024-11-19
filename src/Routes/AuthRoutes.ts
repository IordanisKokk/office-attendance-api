import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PostgresDataSource } from "../dbConfig";
import { User } from "../Entities/User";
import { RoleEnum } from "../Interfaces/Role";

const router = express.Router();

// Register route
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  // Input validation
  if (!username || !email || !password || password.length < 6) {
    res.status(400).json({ error: "Invalid username or password." });
    return;
  }

  try {
    const userRepository = PostgresDataSource.getRepository(User);

    // Check for existing user
    const existingUser = await userRepository.findOneBy({ username });
    if (existingUser) {
      res.status(409).json({ error: "Username already exists." });
    } else {
      // Hash the password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create and save the user
      const newUser = userRepository.create({
        username,
        email,
        password_hash: hashedPassword,
        role: RoleEnum.user,
        created_at: new Date(),
      });

      await userRepository.save(newUser);
      // Success response
      res.status(201).json({ message: "User registered successfully!" });
    }
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Login route
router.post("/login", async (req, res) => {
  /**
   * Extract username and password from request body
   * Validate input
   * Check if user exists and if the password is correct
   * if user exists and password is correct:
   *    Generate a JWT token and send it back to the client
   * else:
   *    Return an error response
   *
   */
  const {username, password } = req.body;

  // Input validation
  if (!username || !password) {
    res.status(400).json({ error: "Invalid username or password." });
    return;
  }

  try {
    const  userRepository = PostgresDataSource.getRepository(User);

    const user = await userRepository.findOneBy({username});

    if(!user) {
      res.status(404).json({error: "User not found."});
      return;
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if(!passwordMatch) {
      res.status(401).json({error: "Invalid password."});
      return;
    }

    // Generate JWT token
    const token = jwt.sign(
      {userID: user.id, username: user.username, role: user.role},
      process.env.JWT_SECRET as string,
      {expiresIn: "1h"}
    )

    res.status(200).json({message: "Login successful!", token});

  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal server error." });
  }
  

});

export default router;
