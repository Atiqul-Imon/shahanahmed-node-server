import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Serve resume file
router.get('/download-resume', (req, res) => {
  const filePath = path.join(__dirname, '../public/resume/Shahan_Ahmed_Resume.pdf');
  res.download(filePath, 'Shahan_Ahmed_Resume.pdf', (err) => {
    if (err) {
      console.error('Error downloading resume:', err);
      res.status(500).send('Could not download the file.');
    }
  });
});

export default router;