import express from "express";
import { verifyToken } from "../middlleware/auth.js";
import { createMessage, getMessages } from "../controllers/messages.js";
const router = express.Router();

/* Add */
router.post('/', createMessage);

/* Get */
router.get('/:converstationId', getMessages)

export default router;