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
const express_1 = require("express");
// import { getTasks, getTask, createTask, updateTask, deleteTask } from '../controllers/_taskController'
const authController_1 = require("../controllers/authController");
const auth_1 = require("../middleware/auth");
const taskController_1 = require("../controllers/taskController");
const router = (0, express_1.Router)();
router.post('/auth/register', authController_1.register);
router.post('/auth/login', authController_1.login);
router.post('/tasks', auth_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, taskController_1.createTask)(req, res);
}));
router.get('/tasks', auth_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, taskController_1.getTasks)(req, res);
}));
// Get a single task
router.get('/task/:taskId', auth_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, taskController_1.getSingleTask)(req, res);
}));
router.put('/tasks/:id', auth_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, taskController_1.updateTask)(req, res);
}));
router.delete('/tasks/:id', auth_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, taskController_1.deleteTask)(req, res);
}));
// router.get('/', getTasks)
// router.get('/:id', getTask)
// router.post('/', createTask)
// router.put('/:id', updateTask)
// router.delete('/:id', deleteTask)
exports.default = router;
