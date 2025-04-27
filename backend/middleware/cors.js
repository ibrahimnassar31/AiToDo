import cors from 'cors';

const corsMiddleware = () => {
  return cors({
    origin:  'http://localhost:3000', // URL العميل
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // الطرق المسموح بها
    allowedHeaders: ['Content-Type', 'Authorization'], // الرؤوس المسموح بها
  });
};

export default corsMiddleware;