"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.firestore = exports.admin = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
exports.admin = firebase_admin_1.default;
const task_management_service_e2d86_firebase_adminsdk_7t6fp_6b9db9edee_json_1 = __importDefault(require("../../task-management-service-e2d86-firebase-adminsdk-7t6fp-6b9db9edee.json"));
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert(task_management_service_e2d86_firebase_adminsdk_7t6fp_6b9db9edee_json_1.default),
});
const firestore = firebase_admin_1.default.firestore();
exports.firestore = firestore;
