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
import router from './routes/general.js';

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
    res.json("Server is running");
});


app.use("/api/user", userRouter);
app.use("/api/blog", blogRouter);
app.use("/api/project", projectRouter);
app.use("/api/snippet", snippetRouter); 
app.use('/api/jobs', jobsRouter);
app.use('/api', router); 

app.use("/api", huggingRouter);

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
