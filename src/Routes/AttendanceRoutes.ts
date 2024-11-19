import express from "express";
import verifyRole, {
  AuthenticatedRequest,
} from "../Middleware/RoleVerificationMiddleware";

const router = express.Router();

/**
 * Route: GET /attendances
 * Access: User role
 */
router.get(
  "/",
  verifyRole("User"),
  (req: AuthenticatedRequest, res) => {
    const userId = req.user!.id;
    res.json({ message: `fetching attendances for user with id: ${userId}` });
  }
);

router.get("/all", verifyRole("Admin"), (req: AuthenticatedRequest, res) => {
    const userId = req.user!.id;
    res.json({ message: `fetching all attendances for the Admin User with id ${userId}` });
});

export default router;