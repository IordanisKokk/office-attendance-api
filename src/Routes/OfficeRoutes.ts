import express from "express";
import verifyRole from "../Middleware/RoleVerificationMiddleware";
import OfficeController from "../Controllers/OfficeController";

const router = express.Router();

router.get("/all", verifyRole(["Admin", "User"]), OfficeController.getAllOffices);
router.post("/", verifyRole("Admin"), OfficeController.createOffice);
router.put("/:id", verifyRole("Admin"), OfficeController.updateOffice);
router.delete("/:id", verifyRole("Admin"), OfficeController.deleteOffice);

export default router;
