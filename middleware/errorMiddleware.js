const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.status || 500;
  const message = err.message || "Internal server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
};

export default errorMiddleware;
