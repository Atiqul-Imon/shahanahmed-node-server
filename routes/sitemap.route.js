import express from 'express';
import Project from '../models/project.model.js';

const router = express.Router();

router.get('/sitemap.xml', async (req, res) => {
  try {
    const projects = await Project.find().sort({ updatedAt: -1 });
    const baseUrl = 'https://www.shahanahmed.com';
    let xml = '<?xml version="1.0" encoding="UTF-8"?>';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

    // Add static pages
    xml += `
      <url>
        <loc>${baseUrl}/</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <priority>1.00</priority>
      </url>
      <url>
        <loc>${baseUrl}/project</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <priority>0.80</priority>
      </url>
      <url>
        <loc>${baseUrl}/contact</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <priority>0.80</priority>
      </url>
    `;

    // Add projects
    projects.forEach(project => {
      xml += `
        <url>
          <loc>${baseUrl}/project/${project._id}</loc>
          <lastmod>${new Date(project.updatedAt).toISOString()}</lastmod>
          <priority>0.64</priority>
        </url>
      `;
    });

    xml += '</urlset>';
    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (error) {
    console.error('Sitemap generation failed:', error);
    res.status(500).send('Error generating sitemap');
  }
});

export default router; 