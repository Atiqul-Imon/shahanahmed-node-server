// routes/jobs.js
import express from 'express';
import axios from 'axios';
const jobsRouter = express.Router();

const APP_ID = process.env.APP_ID; 
const APP_KEY = process.env.APP_KEY

jobsRouter.get('/', async (req, res) => {
  try {
    const { query = 'data analyst', location = 'USA' } = req.query;
    const response = await axios.get(
      `https://api.adzuna.com/v1/api/jobs/us/search/1`, {
        params: {
          app_id: APP_ID,
          app_key: APP_KEY,
          what: query,
          where: location,
      
        }
      }
    );
    res.json(response.data.results);
  } catch (error) {
    console.error(error); 
    res.status(500).json({ error: 'Error fetching job listings' });
  }
});

export default jobsRouter;
