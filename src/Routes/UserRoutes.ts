import express from "express";
import verifyRole from "../Middleware/RoleVerificationMiddleware";
import UserController from "../Controllers/UserController";

const router = express.Router();

router.get(
  "/profile",
  verifyRole(["Admin", "User"]),
  UserController.getProfile
);
router.put(
  "/profile",
  verifyRole(["Admin", "User"]),
  UserController.updateProfile
);

// Admin Only
router.get("/profile/all", verifyRole("Admin"), UserController.listUsers);
router.delete("/profile/:id", verifyRole("Admin"), UserController.deleteUser);

export default router;