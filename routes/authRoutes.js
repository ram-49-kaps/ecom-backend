// routes/authRoutes.js
import express from 'express';
import { signup, login, getProtected } from '../Controllers/authController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/protected', authenticateToken, getProtected);

export default router;
