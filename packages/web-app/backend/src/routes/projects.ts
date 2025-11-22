import { Router } from 'express';
import { z } from 'zod';
import { db, projects } from '../database';
import { authenticate, AuthRequest } from '../middleware/auth';
import { generateId } from '@supranorma/shared';
import { NotFoundError } from '@supranorma/shared';
import { eq } from 'drizzle-orm';

export const projectsRouter = Router();

const createProjectSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

const updateProjectSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  status: z.enum(['active', 'archived', 'completed']).optional(),
});

projectsRouter.use(authenticate);

projectsRouter.get('/', async (req: AuthRequest, res, next) => {
  try {
    const userProjects = await db
      .select()
      .from(projects)
      .where(eq(projects.ownerId, req.user!.id));

    res.json({ projects: userProjects });
  } catch (error) {
    next(error);
  }
});

projectsRouter.get('/:id', async (req: AuthRequest, res, next) => {
  try {
    const [project] = await db
      .select()
      .from(projects)
      .where(eq(projects.id, req.params.id));

    if (!project) {
      throw new NotFoundError('Project not found');
    }

    res.json({ project });
  } catch (error) {
    next(error);
  }
});

projectsRouter.post('/', async (req: AuthRequest, res, next) => {
  try {
    const data = createProjectSchema.parse(req.body);

    const now = Date.now();
    const project = {
      id: generateId('project'),
      name: data.name,
      description: data.description || null,
      ownerId: req.user!.id,
      status: 'active',
      createdAt: now,
      updatedAt: now,
    };

    await db.insert(projects).values(project);

    res.status(201).json({ project });
  } catch (error) {
    next(error);
  }
});

projectsRouter.patch('/:id', async (req: AuthRequest, res, next) => {
  try {
    const data = updateProjectSchema.parse(req.body);

    const [project] = await db
      .select()
      .from(projects)
      .where(eq(projects.id, req.params.id));

    if (!project) {
      throw new NotFoundError('Project not found');
    }

    const updated = await db
      .update(projects)
      .set({
        ...data,
        updatedAt: Date.now(),
      })
      .where(eq(projects.id, req.params.id))
      .returning();

    res.json({ project: updated[0] });
  } catch (error) {
    next(error);
  }
});

projectsRouter.delete('/:id', async (req: AuthRequest, res, next) => {
  try {
    const [project] = await db
      .select()
      .from(projects)
      .where(eq(projects.id, req.params.id));

    if (!project) {
      throw new NotFoundError('Project not found');
    }

    await db.delete(projects).where(eq(projects.id, req.params.id));

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});
