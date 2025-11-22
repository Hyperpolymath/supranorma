import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { db, users } from '../database';
import { generateToken } from '../middleware/auth';
import { ValidationError, UnauthorizedError } from '@supranorma/shared';
import { generateId } from '@supranorma/shared';
import { eq } from 'drizzle-orm';

export const authRouter = Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

authRouter.post('/register', async (req, res, next) => {
  try {
    const data = registerSchema.parse(req.body);

    // Check if user exists
    const existing = await db.select().from(users).where(eq(users.email, data.email));
    if (existing.length > 0) {
      throw new ValidationError('Email already registered');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(data.password, 10);

    // Create user
    const now = Date.now();
    const user = {
      id: generateId('user'),
      email: data.email,
      name: data.name,
      passwordHash,
      createdAt: now,
      updatedAt: now,
    };

    await db.insert(users).values(user);

    // Generate token
    const token = generateToken({ id: user.id, email: user.email });

    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
});

authRouter.post('/login', async (req, res, next) => {
  try {
    const data = loginSchema.parse(req.body);

    // Find user
    const [user] = await db.select().from(users).where(eq(users.email, data.email));

    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // Verify password
    const valid = await bcrypt.compare(data.password, user.passwordHash);

    if (!valid) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // Generate token
    const token = generateToken({ id: user.id, email: user.email });

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
});
