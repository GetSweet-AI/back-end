import express from "express";
import { getClientConnects, saveClientConnect } from "../controllers/ClientConnectController.js";
const router = express.Router();

router.route("/save-client-connect/:userId").post(saveClientConnect);
router.route("/client-connects/:userId").get(getClientConnects);


export default router;
