
import 'dotenv/config';

const env = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/requirement-posting',
  frontendOrigin: process.env.FRONTEND_ORIGIN || 'http://localhost:3000',
  nodeEnv: process.env.NODE_ENV || 'development',
};

export default env;
