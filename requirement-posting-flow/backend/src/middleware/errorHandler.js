import env from '../config/env.js';

const errorHandler = (err, _req, res, _next) => {
  // Log the full stack in development so debugging is painless.
  if (env.nodeEnv === 'development') {
    console.error(err.stack);
  }

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'An unexpected error occurred',
    // Only expose the stack trace in development.
    ...(env.nodeEnv === 'development' && { stack: err.stack }),
  });
};

export default errorHandler;
