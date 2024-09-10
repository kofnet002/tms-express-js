import { Request, Response, NextFunction } from 'express'

class CustomError extends Error {
    status: number | undefined;
}

let tasks = [
    { id: 1, title: "Task One" },
    { id: 2, title: "Task Two" },
    { id: 3, title: "Task Three" },
];

export const getTasks = (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string);
    if (!isNaN(limit) && limit > 0) {
        return res.status(200).json({
            success: true,
            tasks: tasks.slice(0, limit),
        });
    }
    res.status(200).json(tasks)
}

export const getTask = (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id);
    const task = tasks.find(task => task.id === id);
    if (!task) {
        const error = new CustomError(`Task with id ${id} not found`);
        error.status = 404;
        return next(error);
    }

    res.status(200).json({
        success: true,
        task,
    });
}

export const createTask = (req: Request, res: Response, next: NextFunction) => {
    const { title } = req.body;
    if (!title) {
        const error = new CustomError(`Title is required`);
        error.status = 404;
        return next(error);
    }

    const newTask = { id: tasks.length + 1, title };
    tasks.push(newTask);

    res.status(201).json({
        success: true,
        task: newTask,
    });
}

export const updateTask = (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id);
    const task = tasks.find(task => task.id === id);
    if (!task) {
        const error = new CustomError(`Task with id ${id} not found`);
        error.status = 404;
        return next(error);
    }

    const { title } = req.body;

    if (!title) {
        const error = new CustomError(`Title is required`);
        error.status = 404;
        return next(error);
    }

    tasks = tasks.map(task => (task.id === id ? { id, title } : task));

    res.status(200).json({
        success: true,
        task: { id, title },
    });
}

export const deleteTask = (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id);
    const task = tasks.find(task => task.id === id);
    if (!task) {
        const error = new CustomError(`Task with id ${id} not found`);
        error.status = 404;
        return next(error);
    }

    tasks = tasks.filter(task => task.id !== id);

    res.status(200).json({
        success: true,
        message: `Task with id ${id} deleted`,
    });
}