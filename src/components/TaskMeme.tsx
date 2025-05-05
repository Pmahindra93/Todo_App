import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';

interface TaskMemeProps {
  task: string;
}

export const TaskMeme: React.FC<TaskMemeProps> = ({ task }) => {
  const [isLargeTask, setIsLargeTask] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkTaskSize = async () => {
      if (!task || task.trim() === '') return;
      
      try {
        setLoading(true);
        setError(null);
        
        // First classify the task
        console.log('Sending task to classify:', task);
        const classifyResponse = await fetch('http://localhost:3001/api/classify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ task }),
        });
        
        if (!classifyResponse.ok) {
          console.error('Classification response not OK:', await classifyResponse.text());
          throw new Error('Failed to classify task');
        }
        
        const classification = await classifyResponse.json();
        console.log('Classification result:', classification);
        
        if (classification.size && classification.size.isLarge) {
          setIsLargeTask(true);
          
          // Then generate a meme image if it's a large task
          console.log('Generating meme for large task:', task);
          const memeResponse = await fetch('http://localhost:3001/api/meme', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ task }),
          });
          
          if (!memeResponse.ok) {
            console.error('Meme response not OK:', await memeResponse.text());
            throw new Error('Failed to generate meme');
          }
          
          const memeData = await memeResponse.json();
          console.log('Meme data received:', memeData);
          
          if (memeData && memeData.imageUrl) {
            setImageUrl(memeData.imageUrl);
          } else {
            throw new Error('No image URL in response');
          }
        } else {
          setIsLargeTask(false);
          setImageUrl(null);
        }
      } catch (err) {
        console.error('Error in TaskMeme:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
        setIsLargeTask(false);
      } finally {
        setLoading(false);
      }
    };
    
    checkTaskSize();
  }, [task]);

  if (!isLargeTask && !loading) return null;

  return (
    <div className="mt-2">
      {loading ? (
        <Card className="p-4">
          <div className="flex items-center justify-center space-x-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            <span>Analyzing task...</span>
          </div>
        </Card>
      ) : error ? (
        <Card className="p-4 text-destructive">
          <p>Failed to generate meme: {error}</p>
        </Card>
      ) : imageUrl ? (
        <Card className="p-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">This looks like a big task! Here's a meme to cheer you up:</p>
            <div className="relative aspect-video w-full overflow-hidden rounded-lg">
              <img 
                src={imageUrl} 
                alt="Task meme" 
                className="object-cover w-full h-full"
                onError={() => {
                  console.error('Image failed to load:', imageUrl);
                  setError('Failed to load image');
                }}
              />
            </div>
          </div>
        </Card>
      ) : null}
    </div>
  );
};
