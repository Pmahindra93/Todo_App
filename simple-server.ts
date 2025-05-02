import express, { Express, Request, Response, RequestHandler } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {
  generateTaskSuggestion,
  classifyTaskSize,
  generateMemeSuggestion
} from './src/lib/ai.js';

// Load environment variables
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
const handleSuggestion: RequestHandler = async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      res.status(400).json({ error: 'Prompt is required' });
      return;
    }

    const suggestion = await generateTaskSuggestion(prompt);
    res.json({ suggestion });
  } catch (error) {
    console.error('Error generating suggestion:', error);
    res.status(500).json({ error: 'Failed to generate suggestion' });
  }
};

const handleClassify: RequestHandler = async (req, res) => {
  try {
    const { task } = req.body;
    
    if (!task) {
      res.status(400).json({ error: 'Task is required' });
      return;
    }

    const size = await classifyTaskSize(task);
    res.json({ size });
  } catch (error) {
    console.error('Error classifying task:', error);
    res.status(500).json({ error: 'Failed to classify task' });
  }
};

const handleMeme: RequestHandler = async (req, res) => {
  try {
    const { task } = req.body;
    
    if (!task) {
      res.status(400).json({ error: 'Task is required' });
      return;
    }

    const meme = await generateMemeSuggestion(task);
    res.json({ meme });
  } catch (error) {
    console.error('Error generating meme:', error);
    res.status(500).json({ error: 'Failed to generate meme' });
  }
};

app.post('/api/suggestion', handleSuggestion);
app.post('/api/classify', handleClassify);
app.post('/api/meme', handleMeme);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
