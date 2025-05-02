import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';

interface TaskMemeProps {
  task: string;
}

export const TaskMeme: React.FC<TaskMemeProps> = ({ task }) => {
  const [isLargeTask, setIsLargeTask] = useState(false);
  const [memeText, setMemeText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkTaskSize = async () => {
      try {
        setLoading(true);
        
        // First classify the task
        const classifyResponse = await fetch('http://localhost:3001/api/classify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ task }),
        });
        
        if (!classifyResponse.ok) throw new Error('Failed to classify task');
        
        const classification = await classifyResponse.json();
        
        if (classification.isLarge) {
          setIsLargeTask(true);
          
          // Then generate a meme if it's a large task
          const memeResponse = await fetch('http://localhost:3001/api/meme', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ task }),
          });
          
          if (!memeResponse.ok) throw new Error('Failed to generate meme');
          
          const memeData = await memeResponse.json();
          setMemeText(memeData.meme);
        } else {
          setIsLargeTask(false);
          setMemeText(null);
        }
      } catch (err) {
        console.error('Error in task classification:', err);
        setError('Failed to classify task');
      } finally {
        setLoading(false);
      }
    };

    if (task) {
      checkTaskSize();
    }
  }, [task]);

  if (loading) {
    return (
      <div className="mt-2 flex items-center justify-center p-4">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
        <span className="ml-2 text-sm text-muted-foreground">Analyzing task complexity...</span>
      </div>
    );
  }

  if (error) {
    return null; // Don't show anything if there's an error
  }

  if (!isLargeTask || !memeText) {
    return null; // Don't show anything if it's not a large task
  }

  return (
    <Card className="mt-2 p-4 bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
      <div className="flex flex-col">
        <div className="text-sm font-medium mb-1 text-amber-800 dark:text-amber-300">
          This looks like a big task! 
        </div>
        <div className="text-sm italic">
          {memeText}
        </div>
      </div>
    </Card>
  );
};
