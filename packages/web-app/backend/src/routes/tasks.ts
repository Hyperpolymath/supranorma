import { Router } from 'express';
import { z } from 'zod';
import { db, tasks } from '../database';
import { authenticate, AuthRequest } from '../middleware/auth';
import { generateId } from '@supranorma/shared';
import { NotFoundError } from '@supranorma/shared';
import { eq } from 'drizzle-orm';

export const tasksRouter = Router();

const createTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  projectId: z.string(),
  assigneeId: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  dueDate: z.number().optional(),
});

const updateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  status: z.enum(['todo', 'in_progress', 'review', 'done']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  assigneeId: z.string().optional(),
  dueDate: z.number().optional(),
});

tasksRouter.use(authenticate);

tasksRouter.get('/', async (req: AuthRequest, res, next) => {
  try {
    const { projectId } = req.query;

    let query = db.select().from(tasks);

    if (projectId) {
      query = query.where(eq(tasks.projectId, projectId as string)) as any;
    }

    const allTasks = await query;

    res.json({ tasks: allTasks });
  } catch (error) {
    next(error);
  }
});

tasksRouter.get('/:id', async (req: AuthRequest, res, next) => {
  try {
    const [task] = await db
      .select()
      .from(tasks)
      .where(eq(tasks.id, req.params.id));

    if (!task) {
      throw new NotFoundError('Task not found');
    }

    res.json({ task });
  } catch (error) {
    next(error);
  }
});

tasksRouter.post('/', async (req: AuthRequest, res, next) => {
  try {
    const data = createTaskSchema.parse(req.body);

    const now = Date.now();
    const task = {
      id: generateId('task'),
      title: data.title,
      description: data.description || null,
      projectId: data.projectId,
      assigneeId: data.assigneeId || null,
      status: 'todo',
      priority: data.priority,
      dueDate: data.dueDate || null,
      createdAt: now,
      updatedAt: now,
    };

    await db.insert(tasks).values(task);

    res.status(201).json({ task });
  } catch (error) {
    next(error);
  }
});

tasksRouter.patch('/:id', async (req: AuthRequest, res, next) => {
  try {
    const data = updateTaskSchema.parse(req.body);

    const [task] = await db
      .select()
      .from(tasks)
      .where(eq(tasks.id, req.params.id));

    if (!task) {
      throw new NotFoundError('Task not found');
    }

    const updated = await db
      .update(tasks)
      .set({
        ...data,
        updatedAt: Date.now(),
      })
      .where(eq(tasks.id, req.params.id))
      .returning();

    res.json({ task: updated[0] });
  } catch (error) {
    next(error);
  }
});

tasksRouter.delete('/:id', async (req: AuthRequest, res, next) => {
  try {
    const [task] = await db
      .select()
      .from(tasks)
      .where(eq(tasks.id, req.params.id));

    if (!task) {
      throw new NotFoundError('Task not found');
    }

    await db.delete(tasks).where(eq(tasks.id, req.params.id));

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});
