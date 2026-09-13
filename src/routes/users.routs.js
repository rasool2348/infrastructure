import {
  deleteUserById,
  fetchAllUsers,
  fetchUserById,
  updateUserById,
} from '#controllers/user.controller.js';
import { authenticateToken, requireRole } from '#middleware/auth.middleware.js';
import express from 'express';

const usersRouter = express.Router();

usersRouter.get('/', authenticateToken, fetchAllUsers);
usersRouter.get('/:id', authenticateToken, fetchUserById);
usersRouter.put('/:id', authenticateToken, updateUserById);
usersRouter.delete(
  '/:id',
  authenticateToken,
  requireRole(['admin']),
  deleteUserById
);

export default usersRouter;
