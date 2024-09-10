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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = require("../controllers/adminController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Get a single user
router.get('/user/:userId', auth_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, adminController_1.getSingleUser)(req, res);
}));
// Toggle user status (active/inactive)
router.put('/user/:userId/toggle-status', auth_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, adminController_1.toggleUserStatus)(req, res);
}));
// Toggle user role (admin/user)
router.put('/user/:userId/toggle-role', auth_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, adminController_1.toggleUserRole)(req, res);
}));
// Delete user account
router.delete('/user/:userId', auth_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, adminController_1.deleteUserAccount)(req, res);
}));
exports.default = router;
