import express from 'express';
import axios from 'axios';

const huggingRouter = express.Router();

huggingRouter.get('/hf-contributions', async (req, res) => {
  const username = 'shahan24h';

  try {
    const [models, datasets, spaces] = await Promise.all([
      axios.get(`https://huggingface.co/api/models?author=${username}`),
      axios.get(`https://huggingface.co/api/datasets?author=${username}`),
      axios.get(`https://huggingface.co/api/spaces?author=${username}`),
    ]);

    res.json({
      models: models.data,
      datasets: datasets.data,
      spaces: spaces.data,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Failed to fetch Hugging Face data' });
  }
});

export default huggingRouter;
