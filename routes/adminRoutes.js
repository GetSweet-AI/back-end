import express from "express";
import authorize from "../middleware/authorize-role.js";
import { createUser, getAllBrandManagements, getArchiveData, getFeedPostsForAdmin, getTemplatesArchive, getUsers, updateUserRole } from "../controllers/adminController.js";
const router = express.Router();

router.route("/users").get(getUsers);
// Route to update user role
router.put("/users/:userId/update-role", updateUserRole);
router.get("/feedposts",getFeedPostsForAdmin)
router.get("/brand-engagements",getAllBrandManagements)
router.get("/archive",getArchiveData)
router.get("/templates-archive",getTemplatesArchive)

router.post("/create-user",createUser)


export default router;
