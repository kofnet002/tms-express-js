"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.getSingleTask = exports.getTasks = exports.createTask = void 0;
const firebase_1 = require("../services/firebase");
// Create a new task
const createTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, dueDate } = req.body;
    // Validate request body fields
    if (!title || !description || !dueDate) {
        return res.status(400).json({
            success: false,
            message: 'Please provide title, description, and due date',
        });
    }
    const user = req.user;
    // Prepare task data
    const task = {
        id: '',
        title,
        description,
        status: 'todo',
        dueDate: new Date(dueDate).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        user: {
            id: user.id,
            role: user.role,
        },
    };
    // Add new task to Firestore
    const taskRef = firebase_1.firestore.collection('tasks').doc();
    task.id = taskRef.id;
    yield taskRef.set(task);
    return res.status(201).json({ success: true, task });
});
exports.createTask = createTask;
// Fetch all tasks
const getTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    try {
        // Construct query based on user role
        const query = user.role === 'admin'
            ? firebase_1.firestore.collection('tasks').orderBy('createdAt', 'desc')
            : firebase_1.firestore.collection('tasks').where('user.id', '==', user.id).orderBy('createdAt', 'desc');
        // Fetch tasks from Firestore
        const tasksSnapshot = yield query.get();
        const taskList = tasksSnapshot.docs.map(doc => {
            const data = doc.data();
            // Map Firestore document to task object with converted dates
            return data;
        });
        return res.status(200).json({
            success: true,
            total_tasks: taskList.length,
            tasks: taskList,
        });
    }
    catch (error) {
        console.error('Error fetching tasks:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching tasks',
        });
    }
});
exports.getTasks = getTasks;
const getSingleTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { taskId } = req.params;
    const user = req.user;
    try {
        const taskRef = firebase_1.firestore.collection('tasks').doc(taskId);
        const taskDoc = yield taskRef.get();
        if (!taskDoc.exists) {
            return res.status(404).json({
                success: false,
                message: 'Task not found',
            });
        }
        const task = taskDoc.data();
        // If the user is not an admin, ensure they own the task
        if (user.role !== 'admin' && task.user.id !== user.id) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to view this task',
            });
        }
        return res.status(200).json({
            success: true,
            task,
        });
    }
    catch (error) {
        console.error('Error fetching task:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching task',
        });
    }
});
exports.getSingleTask = getSingleTask;
const updateTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params; // Task ID from URL params
    const { title, description, dueDate, status } = req.body; // New task details
    // Validate request body fields
    if (!title || !description || !dueDate || !status) {
        return res.status(400).json({
            success: false,
            message: 'Please provide title, description, due date, and status',
        });
    }
    // Check for valid status
    if (!['todo', 'in-progress', 'done'].includes(status.toLowerCase())) {
        return res.status(400).json({
            success: false,
            message: 'Invalid status',
        });
    }
    try {
        const taskRef = firebase_1.firestore.collection('tasks').doc(id);
        const taskDoc = yield taskRef.get();
        if (!taskDoc.exists) {
            return res.status(404).json({
                success: false,
                message: 'Task not found',
            });
        }
        const task = taskDoc.data();
        // Check if the user is authorized to update the task
        if (task.user.id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not Authorized to update task',
            });
        }
        // Update the task
        yield taskRef.update({
            title,
            description,
            dueDate: new Date(dueDate),
            status,
            updatedAt: new Date(),
        });
        return res.status(200).json({
            success: true,
            message: 'Task updated successfully',
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error updating task',
        });
    }
});
exports.updateTask = updateTask;
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params; // Task ID from URL params
    try {
        const taskRef = firebase_1.firestore.collection('tasks').doc(id);
        const taskDoc = yield taskRef.get();
        if (!taskDoc.exists) {
            return res.status(404).json({
                success: false,
                message: 'Task not found',
            });
        }
        const task = taskDoc.data();
        // Check if the user is authorized to delete the task
        if (task.user.id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not Authorized to delete task',
            });
        }
        // Delete the task
        yield taskRef.delete();
        return res.status(200).json({
            success: true,
            message: 'Task deleted successfully',
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error deleting task',
        });
    }
});
exports.deleteTask = deleteTask;
