import rateLimit from 'express-rate-limit';

const rateLimiterMiddleware = () => {
  return rateLimit({
    windowMs: 15 * 60 * 1000, // 15 دقيقة
    max: 100, // الحد الأقصى للطلبات
    message: 'Too many requests from this IP, please try again later.',
  });
};

export default rateLimiterMiddleware;