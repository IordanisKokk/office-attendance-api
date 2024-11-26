import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../Middleware/RoleVerificationMiddleware";
import { PostgresDataSource } from "../dbConfig";
import { User } from "../Entities/User";
import bcrypt from "bcrypt";

class UserController {
  static async getProfile(req: AuthenticatedRequest, res: Response) {
    const userRepository = PostgresDataSource.getRepository(User);

    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const user = await userRepository.findOneBy({ id: userId });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
      },
    });
  }
  static async updateProfile(req: AuthenticatedRequest, res: Response) {
    try {
      const { username, email, password } = req.body;

      const userRepository = PostgresDataSource.getRepository(User);

      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const user = await userRepository.findOneBy({ id: userId });

      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      if (username) {
        user.username = username;
      }

      if (email) {
        user.email = email;
      }

      if (password) {
        const saltRounds = 10;
        user.password_hash = await bcrypt.hash(password, saltRounds);
      }

      await userRepository.save(user);
      res.status(200).json({
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          created_at: user.created_at,
        },
      });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async deleteUser(req: AuthenticatedRequest, res: Response) {
    try {
      const userRepository = PostgresDataSource.getRepository(User);

      const userId = req.params.id;
      if (!userId) {
        res.status(400).json({ error: "User ID is required" });
        return;
      }

      const user = await userRepository.findOneBy({ id: userId });

      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      await userRepository.delete(userId);

      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
  static async listUsers(req: AuthenticatedRequest, res: Response) {
    const userRepository = PostgresDataSource.getRepository(User);

    const users = await userRepository.find();
    const usersWithoutPassword = users.map((user) => {
      return {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
      };
    });

    res.status(200).json({ users: usersWithoutPassword });
  }
}

export default UserController;
