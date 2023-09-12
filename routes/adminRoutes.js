import express from "express";
import authorize from "../middleware/authorize-role.js";
import { createUser, getAllBrandManagements, getFeedPostsForAdmin, getUsers, updateUserRole } from "../controllers/adminController.js";
const router = express.Router();

router.route("/users").get(getUsers);
// Route to update user role
router.put("/users/:userId/update-role", updateUserRole);
router.get("/feedposts",getFeedPostsForAdmin)
router.get("/brand-engagements",getAllBrandManagements)

router.post("/create-user",createUser)


export default router;
