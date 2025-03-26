
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { MessageSquare, ThumbsUp, ThumbsDown, Clock } from 'lucide-react';

export type CommentType = {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  upvotes: number;
  downvotes: number;
  comments?: CommentReplyType[];
};

export type CommentReplyType = {
  id: string;
  content: string;
  author: string;
  createdAt: string;
  upvotes: number;
  downvotes: number;
};

interface CommentProps {
  comment: CommentType;
  onUpvote: (id: string) => void;
  onDownvote: (id: string) => void;
}

const Comment: React.FC<CommentProps> = ({ comment, onUpvote, onDownvote }) => {
  const [expanded, setExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const MAX_PREVIEW_LENGTH = 200;
  
  const needsExpansion = comment.content.length > MAX_PREVIEW_LENGTH;
  const displayContent = expanded 
    ? comment.content 
    : needsExpansion 
      ? `${comment.content.substring(0, MAX_PREVIEW_LENGTH).trim()}...` 
      : comment.content;

  const hasComments = comment.comments && comment.comments.length > 0;
  const visibleComments = showComments 
    ? comment.comments 
    : comment.comments?.slice(0, 2);

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
            <span className="whitespace-nowrap">{comment.createdAt}</span>
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
          className="text-xs font-medium text-primary/70 hover:underline focus:outline-none focus:ring-2 focus:ring-primary/20 rounded px-2 py-1 transition-all"
        >
          {expanded ? "Less" : "More"}
        </button>
      )}

      <div className="flex items-center justify-between mt-2 pt-2 border-t text-muted-foreground text-xs">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onUpvote(comment.id)} 
            className="flex items-center gap-1 hover:text-primary transition-colors"
          >
            <ThumbsUp size={14} />
            <span>{comment.upvotes}</span>
          </button>
          <button 
            onClick={() => onDownvote(comment.id)} 
            className="flex items-center gap-1 hover:text-destructive transition-colors"
          >
            <ThumbsDown size={14} />
            <span>{comment.downvotes}</span>
          </button>
          {hasComments && (
            <div className="flex items-center">
              <MessageSquare size={14} className="mr-1" />
              <span>{comment.comments?.length || 0}</span>
            </div>
          )}
        </div>
      </div>

      {hasComments && (
        <div className="mt-4 pt-2 border-t">
          <h4 className="text-xs font-medium mb-2">Comments</h4>
          <div className="space-y-3 pl-2 border-l">
            {visibleComments?.map(reply => (
              <div key={reply.id} className="text-xs">
                <div className="flex justify-between items-start">
                  <p className="font-medium">{reply.author}</p>
                  <span className="text-muted-foreground text-[10px] whitespace-nowrap">{reply.createdAt}</span>
                </div>
                <p className="mt-1">{reply.content}</p>
                <div className="flex items-center gap-3 mt-1">
                  <button className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
                    <ThumbsUp size={10} />
                    <span>{reply.upvotes}</span>
                  </button>
                  <button className="flex items-center gap-1 text-muted-foreground hover:text-destructive transition-colors">
                    <ThumbsDown size={10} />
                    <span>{reply.downvotes}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {comment.comments && comment.comments.length > 2 && (
            <button
              onClick={() => setShowComments(!showComments)}
              className="text-xs text-primary/70 mt-2 hover:underline"
            >
              {showComments ? "Less comments" : "More comments"}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Comment;
