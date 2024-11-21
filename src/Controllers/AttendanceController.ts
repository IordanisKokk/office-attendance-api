import { Request, Response } from "express";
import { PostgresDataSource } from "../dbConfig";
import { AuthenticatedRequest } from "../Middleware/RoleVerificationMiddleware";
import { Attendances } from "../Entities/Attendances";
import { User } from "../Entities/User";
import { Office } from "../Entities/Office";

const checkValidDate = (date: Date): boolean => {
  const currentDate = new Date();
  const attendanceDate = new Date(date);
  return (
    currentDate.getMonth() === attendanceDate.getMonth() &&
    currentDate.getFullYear() === attendanceDate.getFullYear()
  );
};

class AttendanceController {
  static async getAllAttendances(req: AuthenticatedRequest, res: Response) {
    try {
      const attendanceRepository =
        PostgresDataSource.getRepository(Attendances);
      const userId = req.user!.id;

      const attendances = await attendanceRepository.find({
        where: { user: { id: userId } },
        relations: ["office"],
      });

      res.status(200).json({ attendances });
    } catch (error) {
      console.error("Error fetching Attendances", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async getAttendance(req: AuthenticatedRequest, res: Response) {
    try {
      const attendanceRepository =
        PostgresDataSource.getRepository(Attendances);
      const attendanceId = req.params.id;
      const userId = req.user!.id;
      console.log("userId", userId);
      console.log("attendanceId", attendanceId);
      const attendance = await attendanceRepository.findOne({
        where: { id: attendanceId },
        relations: ["user", "office"],
      });

      if (!attendance) {
        res.status(404).json({ message: "Attendance not found" });
        return;
      }

      if (attendance.user.id !== userId) {
        res.status(403).json({
          message: "Forbidden! User can only view his own attendances",
        });
        return;
      }

      res.status(200).json({ attendance });
    } catch (error) {
      console.error("Error fetching attendance", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async createAttendance(req: AuthenticatedRequest, res: Response) {
    try {
      const { date, officeId, status } = req.body;

      if (!date || !status) {
        res.status(400).json({ message: "Invalid request" });
        return;
      }

      const isValidDate = checkValidDate(date);
      if (!isValidDate) {
        res.status(400).json({ message: "Invalid date" });
        return;
      }

      // check if attendance with same date exists
      const attendanceRepository =
        PostgresDataSource.getRepository(Attendances);
      const existingAttendance = await attendanceRepository.findOneBy({
        date: new Date(date),
        user: { id: req.user!.id },
      });

      if (existingAttendance) {
        res.status(409).json({ message: "Attendance already exists" });
        return;
      }

      const officeRepository = PostgresDataSource.getRepository(Office);
      const userRepository = PostgresDataSource.getRepository(User);
      let office: Office | null = null;

      if (officeId) {
        office = await officeRepository.findOneBy({ id: officeId });
        if (!office) {
          res.status(404).json({ message: "Office not found." });
          return;
        }
      }

      const user = await userRepository.findOneBy({ id: req.user!.id });

      if (!user) {
        res.status(404).json({ message: "User not found." });
        return;
      }

      const attendance = attendanceRepository.create({
        date: new Date(date),
        status,
        office,
        user: { id: req.user!.id } as User,
      });

      const savedAttendance = await attendanceRepository.save(attendance);

      res.status(201).json({ attendance: savedAttendance });
    } catch (error) {
      console.error("Error creating attendance", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  static async updateAttendance(req: AuthenticatedRequest, res: Response) {
    try {
      const { date, officeId, status } = req.body;
      const attendanceId = req.params.id;
      const userId = req.user!.id;

      if (!date || !status) {
        res.status(400).json({ message: "Invalid request" });
        return;
      }

      const isValidDate = checkValidDate(date);
      if (!isValidDate) {
        res.status(400).json({ message: "Invalid date" });
        return;
      }

      const attendanceRepository =
        PostgresDataSource.getRepository(Attendances);
      const officeRepository = PostgresDataSource.getRepository(Office);
      const userRepository = PostgresDataSource.getRepository(User);

      const attendance = await attendanceRepository.findOneBy({
        id: attendanceId,
      });

      if (!attendance) {
        res.status(404).json({ message: "Attendance not found" });
        return;
      }

      if (attendance.user.id !== userId) {
        res.status(403).json({
          message: "Forbidden! User can only update his own attendances",
        });
        return;
      }

      let office: Office | null = null;
      if (officeId) {
        office = await officeRepository.findOneBy({ id: officeId });
        if (!office) {
          res.status(404).json({ message: "Office not found." });
          return;
        }
      }

      const user = await userRepository.findOneBy({ id: userId });

      if (!user) {
        res.status(404).json({ message: "User not found." });
        return;
      }

      attendance.date = new Date(date);
      attendance.status = status;
      attendance.office = office;

      const updatedAttendance = await attendanceRepository.save(attendance);

      res.status(200).json({ attendance: updatedAttendance });
    } catch (error) {
      console.error("Error updating attendance", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  static async deleteAttendance(req: AuthenticatedRequest, res: Response) {
    try {
      const attendanceRepository =
        PostgresDataSource.getRepository(Attendances);
      const attendanceId = req.params.id;
      const userId = req.user!.id;

      const attendance = await attendanceRepository.findOne({
        where: { id: attendanceId },
        relations: ["user"],
      });
      if (!attendance) {
        res.status(404).json({ message: "Attendance not found" });
        return;
      }

      if (attendance.user.id !== userId) {
        res.status(403).json({
          message: "Forbidden! User can only delete his own attendances",
        });
        return;
      }
      await attendanceRepository.delete(attendanceId);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting attendance", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

export default AttendanceController;
