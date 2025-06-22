import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import connectDB from './config/db.config.js';
import userRouter from './routes/user.route.js';
import blogRouter from './routes/blog.route.js';
import snippetRouter from './routes/snippet.route.js';
import jobsRouter from './routes/jobs.js';
import huggingRouter from './routes/huggingface.js';
import projectRouter from './routes/project.route.js';
import imageRouter from './routes/image.route.js';
import contactRouter from './routes/contact.route.js';
import generalRouter from './routes/general.js';

// --- Global Error Handlers ---
process.on('uncaughtException', (error) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(error.name, error.message);
  console.error(error.stack);
  process.exit(1);
});

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev')); 
app.use(helmet({
    crossOriginEmbedderPolicy: false
}));


app.get('/', (req, res) => {
    res.send('Server is running');
});


app.use("/api/user", userRouter);
app.use("/api/project", projectRouter);
app.use("/api/snippet", snippetRouter);
app.use("/api/blog", blogRouter);
app.use("/api/jobs", jobsRouter);
app.use("/api", huggingRouter);
app.use("/api/image", imageRouter);
app.use("/api/contact", contactRouter);
app.use("/api", generalRouter);

const PORT = process.env.PORT || 5000;

const server = connectDB().then(() => {
    return app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});

process.on('unhandledRejection', (error) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(error.name, error.message);
  server.then(s => s.close(() => {
    process.exit(1);
  }));
});
