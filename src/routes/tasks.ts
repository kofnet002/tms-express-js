import { Router, Request, Response } from 'express'
// import { getTasks, getTask, createTask, updateTask, deleteTask } from '../controllers/_taskController'
import { login, register } from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { createTask, getTasks, updateTask, deleteTask, getSingleTask } from '../controllers/taskController';
import { User } from '../models/user';
import { AuthenticatedRequest } from '../types/request';

const router = Router()

router.post('/auth/register', register);
router.post('/auth/login', login);

router.post('/tasks', authenticate, async (req: any, res: Response) => {
    await createTask(req, res);
});

router.get('/tasks', authenticate, async (req: any, res: Response) => {
    await getTasks(req, res);
});

// Get a single task
router.get('/task/:taskId', authenticate, async (req: any, res: Response) => {
    await getSingleTask(req, res);
});

router.put('/tasks/:id', authenticate, async (req: any, res: Response) => {
    await updateTask(req, res);
});

router.delete('/tasks/:id', authenticate, async (req: any, res: Response) => {
    await deleteTask(req, res);
});



// router.get('/', getTasks)
// router.get('/:id', getTask)
// router.post('/', createTask)
// router.put('/:id', updateTask)
// router.delete('/:id', deleteTask)

export default router