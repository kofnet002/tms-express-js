import { Request, Response, NextFunction } from "express";
import colors from 'colors';

type MethodColor = {
    [key: string]: string;
}

interface ColorsModule {
    [key: string]: (text: string) => string;
}

const methodColor: MethodColor = {
    GET: 'green',
    POST: 'blue',
    PUT: 'yellow',
    DELETE: 'red',
}

const logger = (req: Request, res: Response, next: NextFunction) => {
    const color = methodColor[req.method] || 'white';
    console.log((colors as unknown as ColorsModule)[color](`${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`));
    next();
}

export default logger;