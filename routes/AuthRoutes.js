import express from 'express';
import logger from '../config/logger.js';
import { SignIn, exampleController } from '../controller/AuthController.js';

const router = express.Router();

// Log every request that comes to this router (optional)
router.use((req, res, next) => {
  logger.info(`📥 ${req.method} ${req.originalUrl} hit`);
  next();
});

// Authentication Routes
router.post('/signin', (req, res) => {
  logger.debug(`🟡 Sign-in body: ${JSON.stringify(req.body)}`);
  SignIn(req, res);
});

router.get('/example', exampleController);

router.get('/test-log', (req, res) => {
  logger.info('✅ Test route accessed');
  logger.warn('⚠️ This is a warning example');
  logger.debug('🐞 Debugging some internal data...');
  logger.error('❌ Simulated error message for testing');

  res.status(200).json({ message: 'Logging test route executed successfully' });
});



export default router;
