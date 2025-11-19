// server/middleware/errorMiddleware.js
const errorHandler = (err, req, res, next) => {
  console.error("Server Error:", err);

  const status = err.status || 500;
  const message = err.message || "Internal server error";

  res.status(status).json({ message });
};

export default errorHandler;
