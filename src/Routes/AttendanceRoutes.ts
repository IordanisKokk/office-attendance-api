import express from "express";
import verifyRole, {
  AuthenticatedRequest,
} from "../Middleware/RoleVerificationMiddleware";
import AttendanceController from "../Controllers/AttendanceController";

const router = express.Router();

router.get("/", verifyRole("User"), AttendanceController.getAllAttendances);
router.get("/:id", verifyRole("User"), AttendanceController.getAttendance);
router.post("/", verifyRole("User"), AttendanceController.createAttendance);
router.put("/:id", verifyRole("User"), AttendanceController.updateAttendance);
router.delete("/:id", verifyRole("User"), AttendanceController.deleteAttendance);

export default router;
