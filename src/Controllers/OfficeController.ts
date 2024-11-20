import { Request, Response } from "express";
import { Office } from "../Entities/Office";
import { PostgresDataSource } from "../dbConfig";
import { AuthenticatedRequest } from "../Middleware/RoleVerificationMiddleware";

class OfficeController {
  static async getAllOffices(req: AuthenticatedRequest, res: Response) {
    try {
      const officeRepository = PostgresDataSource.getRepository(Office);
      const offices = await officeRepository.find();
      console.log("Offices fetched:", offices);
      res.status(200).json({ offices: offices });
    } catch (error) {
      console.error("Error during fetching offices:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async createOffice(req: AuthenticatedRequest, res: Response) {
    try {
      const officeRepository = PostgresDataSource.getRepository(Office);
      const office = new Office();
      office.officeName = req.body.officeName;
      office.location = req.body.location;
      office.address = req.body.address;
      office.created_at = new Date();

      const createdOffice = await officeRepository.save(office);
      res.status(201).json({ office: createdOffice });
    } catch (error) {
      console.error("Error during creating office:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async updateOffice(req: AuthenticatedRequest, res: Response) {
    try {
      const officeRepository = PostgresDataSource.getRepository(Office);
      const officeID = req.params.id;
      console.log(`Request Parameters ID: ${req.params.id}`);
      console.log(`Office ID: ${officeID}`);
      const office = await officeRepository.findOneBy({ id: officeID });
      if (!office) {
        res.status(404).json({ error: "Office not found" });
        return;
      }
      office.officeName = req.body.officeName;
      office.location = req.body.location;
      office.address = req.body.address;

      const updatedOffice = await officeRepository.save(office);
      res.status(200).json({ office: updatedOffice });
    } catch (error) {
      console.error("Error during updating office:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async deleteOffice(req: AuthenticatedRequest, res: Response) {
    try {
      const officeRepository = PostgresDataSource.getRepository(Office);
      const officeID = req.params.id;
      const office = await officeRepository.findOneBy({ id: officeID });

      if (!office) {
        res.status(404).json({ error: "Office not found" });
        return;
      }

      await officeRepository.delete({ id: officeID });
      res.status(204).json();
    } catch (error) {
      console.error("Error during updating office:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

export default OfficeController;
