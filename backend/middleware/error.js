const errorHandlerMiddleware = (err, req, res, ) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
  
    console.error(err);
  
    res.status(statusCode).json({
      success: false,
      message,
      stack:  err.stack ,
    });
  };
  
  export default errorHandlerMiddleware;