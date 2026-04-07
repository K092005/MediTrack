// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Something went wrong on the server',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

module.exports = errorHandler;