
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { MessageSquare, Clock } from 'lucide-react';

export type CommentType = {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
};

interface CommentProps {
  comment: CommentType;
}

const Comment: React.FC<CommentProps> = ({ comment }) => {
  const [expanded, setExpanded] = useState(false);
  const MAX_PREVIEW_LENGTH = 120;
  
  const needsExpansion = comment.content.length > MAX_PREVIEW_LENGTH;
  const displayContent = expanded 
    ? comment.content 
    : needsExpansion 
      ? `${comment.content.substring(0, MAX_PREVIEW_LENGTH).trim()}...` 
      : comment.content;

  return (
    <div 
      className={cn(
        "group relative rounded-xl border bg-card p-5 mb-4 shadow-sm",
        "transition-all duration-300 ease-in-out hover:shadow-md",
        "animate-slide-in"
      )}
    >
      <div className="mb-4">
        <div className="flex justify-between items-start">
          <h3 className="text-base font-medium text-card-foreground">
            {comment.title}
          </h3>
          <div className="flex items-center text-muted-foreground text-xs">
            <Clock size={12} className="mr-1" />
            <span>{comment.createdAt}</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          By {comment.author}
        </p>
      </div>

      <div className="mb-4">
        <p className="text-sm text-card-foreground/90 whitespace-pre-line">
          {displayContent}
        </p>
      </div>

      {needsExpansion && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs font-medium text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary/20 rounded px-2 py-1 transition-all"
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      )}

      <div className="flex items-center mt-2 pt-2 border-t text-muted-foreground text-xs">
        <div className="flex items-center mr-4">
          <MessageSquare size={14} className="mr-1" />
          <span>Comment</span>
        </div>
      </div>
    </div>
  );
};

export default Comment;
