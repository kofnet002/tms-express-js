"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const tasks_1 = __importDefault(require("./routes/tasks"));
const users_1 = __importDefault(require("./routes/users"));
const path_1 = __importDefault(require("path"));
const logger_1 = __importDefault(require("./middleware/logger"));
const error_1 = __importDefault(require("./middleware/error"));
const notFound_1 = __importDefault(require("./middleware/notFound"));
dotenv_1.default.config();
const port = process.env.PORT || 8080;
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// console.log(__dirname);
const app = (0, express_1.default)();
// Body parser middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
// logger middleware
app.use(logger_1.default);
// Routes
app.use('/api/v1', tasks_1.default);
app.use('/api/v1', users_1.default);
// Not found middleware
app.use(notFound_1.default);
// Error handler middleware
app.use(error_1.default);
// setup static folder
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express_1.default.static(path_1.default.join(path_1.default.dirname(__dirname), 'public')));
// app.get('/', (req: Request, res: Response) => {
//     res.send('Hello World');
// });
app.listen(port, () => console.log(`Server is running on port ${port}`));
