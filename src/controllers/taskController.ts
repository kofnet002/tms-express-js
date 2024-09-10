import { Request, Response } from 'express';
import { firestore } from '../services/firebase';
import { Task } from '../models/task';
import { User } from '../models/user';
import { AuthenticatedRequest } from '../types/request';

// Create a new task
export const createTask = async (req: AuthenticatedRequest, res: Response) => {
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
    const task: Task = {
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
    const taskRef = firestore.collection('tasks').doc();
    task.id = taskRef.id;
    await taskRef.set(task);

    return res.status(201).json({ success: true, task });
};

// Fetch all tasks
export const getTasks = async (req: AuthenticatedRequest, res: Response) => {
    const user: User = req.user;

    try {
        // Construct query based on user role
        const query = user.role === 'admin'
            ? firestore.collection('tasks').orderBy('createdAt', 'desc')
            : firestore.collection('tasks').where('user.id', '==', user.id).orderBy('createdAt', 'desc');

        // Fetch tasks from Firestore
        const tasksSnapshot = await query.get();
        const taskList = tasksSnapshot.docs.map(doc => {
            const data = doc.data() as Task;

            // Map Firestore document to task object with converted dates
            return data
        });

        return res.status(200).json({
            success: true,
            total_tasks: taskList.length,
            tasks: taskList,
        });
    } catch (error) {
        console.error('Error fetching tasks:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching tasks',
        });
    }
};

export const getSingleTask = async (req: AuthenticatedRequest, res: Response) => {
    const { taskId } = req.params;
    const user: User = req.user;

    try {
        const taskRef = firestore.collection('tasks').doc(taskId);
        const taskDoc = await taskRef.get();

        if (!taskDoc.exists) {
            return res.status(404).json({
                success: false,
                message: 'Task not found',
            });
        }

        const task = taskDoc.data() as Task;

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
    } catch (error) {
        console.error('Error fetching task:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching task',
        });
    }
};

export const updateTask = async (req: AuthenticatedRequest, res: Response) => {
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
        const taskRef = firestore.collection('tasks').doc(id);
        const taskDoc = await taskRef.get();

        if (!taskDoc.exists) {
            return res.status(404).json({
                success: false,
                message: 'Task not found',
            });
        }

        const task = taskDoc.data() as Task;

        // Check if the user is authorized to update the task
        if (task.user.id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not Authorized to update task',
            });
        }

        // Update the task
        await taskRef.update({
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
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error updating task',
        });
    }
};

export const deleteTask = async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params; // Task ID from URL params

    try {
        const taskRef = firestore.collection('tasks').doc(id);
        const taskDoc = await taskRef.get();

        if (!taskDoc.exists) {
            return res.status(404).json({
                success: false,
                message: 'Task not found',
            });
        }

        const task = taskDoc.data() as Task;

        // Check if the user is authorized to delete the task
        if (task.user.id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not Authorized to delete task',
            });
        }

        // Delete the task
        await taskRef.delete();

        return res.status(200).json({
            success: true,
            message: 'Task deleted successfully',
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error deleting task',
        });
    }
};