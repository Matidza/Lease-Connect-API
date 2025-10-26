import logger from '../config/logger.js';  // ✅ include `.js` for ES modules

// User Sign-In Controller
export function SignIn(req, res) {
  try {
    logger.info('🟢 User sign-in attempt', { body: req.body }); // replaced console.log
    // Placeholder sign-in logic
    res.status(200).json({ message: 'User signed in successfully' });
  } catch (error) {
    logger.error(`❌ Sign-in failed: ${error.message}`);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

// Example Controller with multiple log levels
export const exampleController = async (req, res) => {
  try {
    logger.info('🟢 User login request received');

    const user = { id: 1, name: 'Matidza' }; // Example
    // logger.info('🟢 User sign-in attempt', {
    // email: req.body.email,
    // ip: req.ip,
    // endpoint: req.originalUrl,
    // });

    if (!user) {
      logger.warn('⚠️ User not found during login attempt');
      return res.status(404).json({ message: 'User not found' });
    }

    logger.debug(`🔍 User data: ${JSON.stringify(user)}`);
    res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    logger.error(`❌ Login failed: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};


// | Level     | Meaning        | Used For                                   |
// | --------- | -------------- | ------------------------------------------ |
// | `error`   | Most severe    | Crashes, failed DB connections, exceptions |
// | `warn`    | Warnings       | Deprecations, potential issues             |
// | `info`    | General info   | Server start, successful requests          |
// | `http`    | Request info   | (Optional) API calls, HTTP events          |
// | `verbose` | Detailed info  | Step-by-step actions                       |
// | `debug`   | Developer logs | Troubleshooting and local debugging        |
// | `silly`   | Least severe   | Extra noise for deep inspection            |
