
import React, { useRef, useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePost: (title: string, content: string) => void;
}

const MAX_CONTENT_LENGTH = 240;

const CreatePostModal: React.FC<CreatePostModalProps> = ({ 
  isOpen, 
  onClose,
  onCreatePost
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  
  const overlayRef = useRef<HTMLDivElement>(null);
  
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    if (newContent.length <= MAX_CONTENT_LENGTH) {
      setContent(newContent);
      setError('');
    } else {
      setError('Your post exceeds the maximum 240 characters');
    }
  };
  
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Please enter a title');
      return;
    }
    
    if (!content.trim()) {
      setError('Please enter some content');
      return;
    }
    
    onCreatePost(title, content);
    toast.success('Your post has been published!');
    setTitle('');
    setContent('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      ref={overlayRef}
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-4",
        "bg-black/50 backdrop-blur-sm",
        isOpen ? "animate-fade-in" : "animate-fade-out"
      )}
      onClick={handleOverlayClick}
    >
      <div 
        className={cn(
          "w-full max-w-md rounded-lg bg-card p-6 shadow-xl",
          "animate-scale-in border",
        )}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Create a New Post</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-muted transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label 
                htmlFor="title" 
                className="block text-sm font-medium mb-1"
              >
                Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={cn(
                  "w-full rounded-md border px-3 py-2 text-sm",
                  "bg-background",
                  "focus:outline-none focus:ring-2 focus:ring-primary/30"
                )}
                placeholder="What's on your mind?"
              />
            </div>
            
            <div>
              <label 
                htmlFor="content" 
                className="block text-sm font-medium mb-1"
              >
                Content
              </label>
              <textarea
                id="content"
                value={content}
                onChange={handleContentChange}
                className={cn(
                  "w-full rounded-md border px-3 py-2 text-sm",
                  "bg-background min-h-[100px] resize-none",
                  "focus:outline-none focus:ring-2 focus:ring-primary/30"
                )}
                placeholder="Share your political thoughts (max 240 characters)"
              />
              <div className="flex justify-between items-center mt-1">
                <span className={cn(
                  "text-xs",
                  content.length > MAX_CONTENT_LENGTH * 0.8 
                    ? "text-destructive" 
                    : "text-muted-foreground"
                )}>
                  {content.length}/{MAX_CONTENT_LENGTH}
                </span>
              </div>
            </div>
            
            {error && (
              <div className="text-destructive text-sm p-2 bg-destructive/10 rounded-md">
                {error}
              </div>
            )}
            
            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-md",
                  "bg-secondary text-secondary-foreground",
                  "hover:bg-secondary/80 transition-colors"
                )}
              >
                Cancel
              </button>
              
              <button
                type="submit"
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-md",
                  "bg-primary text-primary-foreground",
                  "hover:bg-primary/90 transition-colors",
                  "focus:outline-none focus:ring-2 focus:ring-primary/30"
                )}
              >
                Post
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;
