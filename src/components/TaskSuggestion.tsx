import React, { useState, useEffect } from 'react';
import { 
  TooltipProvider, 
  TooltipRoot, 
  TooltipTrigger, 
  TooltipContent 
} from '@/components/ui/tooltip';

interface TaskSuggestionProps {
  task: string;
  children?: React.ReactNode;
}

export const TaskSuggestion: React.FC<TaskSuggestionProps> = ({ task, children }) => {
  const [isHovering, setIsHovering] = useState(false);
  const [suggestion, setSuggestion] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Function to fetch suggestion
    const fetchSuggestion = async () => {
      if (!task || !isHovering) return;
      
      setIsLoading(true);
      setSuggestion('');
      setError(null);
      
      try {
        const response = await fetch('http://localhost:3001/api/suggestion', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt: task }),
        });
        
        if (!response.ok) {
          throw new Error(`Server responded with ${response.status}`);
        }
        
        const data = await response.json();
        setSuggestion(data.text || 'No suggestion available');
      } catch (err) {
        console.error('Error fetching suggestion:', err);
        setError('Failed to get suggestion');
      } finally {
        setIsLoading(false);
      }
    };
    
    // When the user hovers and we don't have a suggestion yet, fetch it
    if (isHovering && !suggestion && !isLoading) {
      fetchSuggestion();
    }
  }, [isHovering, suggestion, isLoading, task]);

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  return (
    <TooltipProvider>
      <TooltipRoot open={isHovering}>
        <TooltipTrigger asChild>
          <div 
            onMouseEnter={handleMouseEnter} 
            onMouseLeave={handleMouseLeave}
            className="w-full h-full"
          >
            {children}
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs z-50 bg-white dark:bg-gray-800 p-3 shadow-lg rounded-md border border-gray-200 dark:border-gray-700">
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
              <span>Thinking...</span>
            </div>
          ) : (
            <div>
              <h4 className="font-semibold mb-1">How to get started:</h4>
              <p>{suggestion || "Hover to get a suggestion"}</p>
              {error && <p className="text-red-500 text-xs mt-1">Error: {error}</p>}
            </div>
          )}
        </TooltipContent>
      </TooltipRoot>
    </TooltipProvider>
  );
};
