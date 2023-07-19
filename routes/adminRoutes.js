import express from "express";
import authorize from "../middleware/authorize-role.js";
import { getFeedPostsForAdmin, getUsers, updateUserRole } from "../controllers/adminController.js";
const router = express.Router();

router.route("/users").get(getUsers);
// Route to update user role
router.put("/users/:userId/update-role", updateUserRole);
router.get("/feedposts",getFeedPostsForAdmin)


export default router;
