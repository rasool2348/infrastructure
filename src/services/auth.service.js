import logger from '#config/logger.js';
import bcrypt from 'bcrypt';
import { db } from '#config/database.js';
import { eq } from 'drizzle-orm';
import { users } from '#models/user.model.js';

export const hashPassword = async password => {
  try {
    return await bcrypt.hash(password, 10);
  } catch (error) {
    logger.error(`Error hashing password: ${error}`);
    throw new Error('Error hashing', { cause: error });
  }
};

export const createUser = async ({ name, email, password, role = 'user' }) => {
  let existingUser = [];
  try {
    existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    if (existingUser.length > 0) throw new Error('User already exist');
    const password_hash = await hashPassword(password);
    const [newUser] = await db
      .insert(users)
      .values({ name, email, password: password_hash, role })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        create_at: users.create_at,
      });

    logger.info(`User ${newUser.email} created successfully`);
    return newUser;
  } catch (error) {
    logger.error('Real error in createUser:', {
      message: error.message,
      cause: error.cause,
      stack: error.stack,
      full: error,
    });
    if (existingUser.length > 0)
      throw new Error('User already exist', { cause: error });
    throw new Error('Error creating user', { cause: error });
  }
};
