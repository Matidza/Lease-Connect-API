import express from 'express';
import { SignIn } from '../controller/AuthController.js';

const router = express.Router();

// Authentification Routes
router.post('signin', SignIn)

export default router;