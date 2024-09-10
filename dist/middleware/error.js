"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler = (err, req, res, next) => {
    if (err.status) {
        res.status(err.status).json({
            success: false,
            message: err.message,
        });
    }
    else {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};
exports.default = errorHandler;
