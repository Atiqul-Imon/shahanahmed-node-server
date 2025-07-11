import express from 'express';
import { sendContactEmail } from '../controllers/contact.controller.js';
import { contactLimiter } from '../middlewares/rateLimit.js';

const router = express.Router();

// POST /api/contact - Send contact form email
router.post('/contact', contactLimiter, sendContactEmail);

export default router; 