import express from 'express';
import cors from 'cors';
import { OpenAI } from 'openai';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// API Routes
app.post('/api/suggestion', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const stream = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that provides brief, practical suggestions on how to get started with tasks.'
        },
        {
          role: 'user',
          content: `I need to: ${prompt}. Give me a brief, practical suggestion on how to get started with this task in 1-2 sentences.`
        }
      ],
      max_tokens: 100,
      temperature: 0.7,
      stream: true,
    });

    // Set appropriate headers for streaming
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Stream the response
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        res.write(`data: ${JSON.stringify({ text: content })}\n\n`);
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    console.error('Error generating suggestion:', error);
    res.status(500).json({ error: 'Failed to generate suggestion' });
  }
});

app.post('/api/classify', async (req, res) => {
  try {
    const { task } = req.body;
    
    if (!task) {
      return res.status(400).json({ error: 'Task is required' });
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a task classifier that determines if a task is very large or complex.'
        },
        {
          role: 'user',
          content: `Is this task very large or complex: "${task}"? Respond with a JSON object with two properties: "isLarge" (boolean) and "reason" (string explaining why).`
        }
      ],
      max_tokens: 150,
      temperature: 0.3,
      response_format: { type: 'json_object' },
    });

    const result = JSON.parse(response.choices[0].message.content || '{"isLarge": false, "reason": "Could not determine"}');
    res.json(result);
  } catch (error) {
    console.error('Error classifying task:', error);
    res.status(500).json({ error: 'Failed to classify task' });
  }
});

app.post('/api/meme', async (req, res) => {
  try {
    const { task } = req.body;
    
    if (!task) {
      return res.status(400).json({ error: 'Task is required' });
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a creative assistant that generates humorous meme ideas related to large, complex tasks.'
        },
        {
          role: 'user',
          content: `Generate a funny meme description for this large task: "${task}". The description should be brief and humorous.`
        }
      ],
      max_tokens: 100,
      temperature: 0.8,
    });

    res.json({ meme: response.choices[0].message.content || 'Could not generate a meme suggestion.' });
  } catch (error) {
    console.error('Error generating meme:', error);
    res.status(500).json({ error: 'Failed to generate meme' });
  }
});

// Catch-all route to serve the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
