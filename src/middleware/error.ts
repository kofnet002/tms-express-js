import { Request, Response, NextFunction } from "express";

const errorHandler = (err: { status: number; message: any; }, req: Request, res: Response, next: NextFunction) => {
    if (err.status) {
        res.status(err.status).json({
            success: false,
            message: err.message,
        });
    } else {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

export default errorHandler;