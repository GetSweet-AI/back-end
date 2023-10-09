import express from "express";
import { addNewTemplate, archiveTemplate, getTemplates } from "../controllers/TemplateController.js";
const router = express.Router();

// Route to update user role
router.post("/add-template/:userId", addNewTemplate);
router.get("/templates", getTemplates);
router.route("/templates/:userId").delete(archiveTemplate)


export default router;
