import OpenAI from 'openai';
import { experimental_generateImage as generateImage } from 'ai';

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// Function to generate task suggestions
export async function generateTaskSuggestion(task: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4.1-nano-2025-04-14',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that provides brief, practical suggestions on how to get started with tasks.'
        },
        {
          role: 'user',
          content: `I need to: ${task}. Give me a brief, practical suggestion on how to get started with this task in 1-2 sentences.`
        }
      ],
      max_tokens: 100,
      temperature: 0.7,
      stream: false,
    });

    return response.choices[0].message.content || 'Could not generate a suggestion at this time.';
  } catch (error) {
    console.error('Error generating task suggestion:', error);
    return 'Could not generate a suggestion at this time.';
  }
}

// Function to classify tasks and determine if they are "very large"
export async function classifyTaskSize(task: string): Promise<{ isLarge: boolean; reason: string }> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4.1-nano-2025-04-14',
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
    return result;
  } catch (error) {
    console.error('Error classifying task:', error);
    return { isLarge: false, reason: 'Error during classification' };
  }
}

// Function to generate a meme image for large tasks
export async function generateMemeSuggestion(task: string): Promise<{ imageUrl: string }> {
  try {
    // First, generate a creative meme prompt based on the task
    const promptResponse = await openai.chat.completions.create({
      model: 'gpt-4.1-nano-2025-04-14',
      messages: [
        {
          role: 'system',
          content: 'You are a creative meme generator. Create a funny, relatable prompt for an image that represents the overwhelming feeling of a large task.'
        },
        {
          role: 'user',
          content: `Create a funny image prompt that represents the overwhelming feeling of this task: "${task}". Make it humorous and relatable to developers/tech workers.`
        }
      ],
      max_tokens: 100,
      temperature: 0.8,
    });

    const memePrompt = promptResponse.choices[0].message.content || 'A developer looking overwhelmed at their computer';

    // Generate the actual image using gpt-image-1
    const { image } = await generateImage({
      model: openai.image('gpt-image-1'),
      prompt: memePrompt,
    });

    return { imageUrl: image };
  } catch (error) {
    console.error('Error generating meme image:', error);
    throw error;
  }
}
