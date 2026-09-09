const isDev = process.env.NODE_ENV !== 'production';

const errorHandler = (err, _req, res, _next) => {
  // Log the full stack in development so debugging is painless.
  if (isDev) {
    console.error(err.stack);
  }

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'An unexpected error occurred',
    // Only expose the stack trace in development.
    ...(isDev && { stack: err.stack }),
  });
};

export default errorHandler;
