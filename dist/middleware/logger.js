"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const colors_1 = __importDefault(require("colors"));
const methodColor = {
    GET: 'green',
    POST: 'blue',
    PUT: 'yellow',
    DELETE: 'red',
};
const logger = (req, res, next) => {
    const color = methodColor[req.method] || 'white';
    console.log(colors_1.default[color](`${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`));
    next();
};
exports.default = logger;
