import { Router } from 'express';
import { db, users } from '../database';
import { authenticate, AuthRequest } from '../middleware/auth';
import { NotFoundError } from '@supranorma/shared';
import { eq } from 'drizzle-orm';

export const usersRouter = Router();

usersRouter.use(authenticate);

usersRouter.get('/me', async (req: AuthRequest, res, next) => {
  try {
    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, req.user!.id));

    if (!user) {
      throw new NotFoundError('User not found');
    }

    res.json({ user });
  } catch (error) {
    next(error);
  }
});

usersRouter.get('/:id', async (req: AuthRequest, res, next) => {
  try {
    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, req.params.id));

    if (!user) {
      throw new NotFoundError('User not found');
    }

    res.json({ user });
  } catch (error) {
    next(error);
  }
});
