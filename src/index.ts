import express, { Express } from 'express';
import dotevn from 'dotenv';
import tasks from './routes/tasks'
import users from './routes/users'
import path from 'path';
import { fileURLToPath } from 'url'
import logger from './middleware/logger';
import errorHandler from './middleware/error';
import notFound from './middleware/notFound';

dotevn.config();

const port = process.env.PORT || 8080;

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// console.log(__dirname);


const app: Express = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// logger middleware
app.use(logger);

// Routes
app.use('/api/v1', tasks)
app.use('/api/v1', users)


// Not found middleware
app.use(notFound);

// Error handler middleware
app.use(errorHandler);

// setup static folder
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(path.dirname(__dirname), 'public')));


// app.get('/', (req: Request, res: Response) => {
//     res.send('Hello World');
// });

app.listen(port, () => console.log(`Server is running on port ${port}`));