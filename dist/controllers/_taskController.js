"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.createTask = exports.getTask = exports.getTasks = void 0;
class CustomError extends Error {
}
let tasks = [
    { id: 1, title: "Task One" },
    { id: 2, title: "Task Two" },
    { id: 3, title: "Task Three" },
];
const getTasks = (req, res) => {
    const limit = parseInt(req.query.limit);
    if (!isNaN(limit) && limit > 0) {
        return res.status(200).json({
            success: true,
            tasks: tasks.slice(0, limit),
        });
    }
    res.status(200).json(tasks);
};
exports.getTasks = getTasks;
const getTask = (req, res, next) => {
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
};
exports.getTask = getTask;
const createTask = (req, res, next) => {
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
};
exports.createTask = createTask;
const updateTask = (req, res, next) => {
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
};
exports.updateTask = updateTask;
const deleteTask = (req, res, next) => {
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
};
exports.deleteTask = deleteTask;
