import logger from '#config/logger.js';
import 'dotenv/config';
import jwt from 'jsonwebtoken';

const JWT_SECRET =
  process.env.JWT_SECRET || 'YOUR-SECRET-KEY-PLEASE-CHANGE-IN-PRODUCTION';
const JWT_EXPIRATION = '1d';

export const jwttoken = {
  sign: payload => {
    try {
      return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
    } catch (error) {
      logger.error('Failed to authenticate token:', error);
      throw new Error('Failed to authenticate token', { cause: error });
    }
  },
  verify: token => {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      logger.error('Failed to verify token:', error);
      throw new Error('Failed to verify token', { cause: error });
    }
  },
};
