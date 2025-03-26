
import React, { useState } from 'react';
import Comment, { CommentType } from './Comment';
import { useSettings } from '@/contexts/SettingsContext';

// Sample data
const SAMPLE_COMMENTS: CommentType[] = [
  {
    id: '1',
    title: 'Healthcare Reform Needed',
    content: "I believe our healthcare system needs major reform. The current approach is leaving too many people without access to proper medical care. We should consider models from other countries that provide universal coverage while maintaining quality and innovation.",
    author: 'PolicyWonk',
    createdAt: '2 hours ago'
  },
  {
    id: '2',
    title: 'Tax Policy Concerns',
    content: 'The latest tax proposal would put an unfair burden on middle-class families while giving unnecessary breaks to corporations. We need to reconsider our priorities and create a more equitable tax system that funds important programs without crushing average citizens.',
    author: 'EconomicThinker',
    createdAt: '5 hours ago'
  },
  {
    id: '3',
    title: 'Climate Action Is Urgent',
    content: "We cannot continue to delay meaningful action on climate change. The science is clear, and we're already seeing the impacts. We need bold policy initiatives that transition us to clean energy without leaving workers behind.",
    author: 'GreenFuture',
    createdAt: '1 day ago'
  },
  {
    id: '4',
    title: 'Education Funding Gap',
    content: 'The disparity in education funding between wealthy and poor districts continues to grow. Every child deserves access to quality education regardless of zip code. We should implement funding reforms that address these inequities.',
    author: 'TeachForAll',
    createdAt: '2 days ago'
  },
  {
    id: '5',
    title: 'Infrastructure Investment',
    content: "Our nation's infrastructure is crumbling, and it's holding back economic growth. We need a comprehensive plan to rebuild roads, bridges, airports, and digital infrastructure. This would create jobs and boost productivity.",
    author: 'BuildItBetter',
    createdAt: '3 days ago'
  }
];

const CommentList: React.FC = () => {
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const { speakText } = useSettings();

  const toggleExpand = (id: string) => {
    setExpandedComments(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleReadAloud = (comment: CommentType) => {
    const textToRead = `${comment.title}. ${comment.content}`;
    speakText(textToRead);
  };

  return (
    <div className="space-y-4">
      {SAMPLE_COMMENTS.map((comment) => {
        const isExpanded = expandedComments[comment.id] || false;
        const displayContent = isExpanded 
          ? comment.content 
          : comment.content.length > 100 
            ? `${comment.content.slice(0, 100)}...` 
            : comment.content;

        return (
          <div key={comment.id} className="rounded-lg border bg-card shadow-sm p-4">
            <h3 className="text-lg font-semibold mb-1">{comment.title}</h3>
            <p className="text-sm mb-2">{displayContent}</p>
            
            <div className="flex justify-between items-center text-xs text-muted-foreground mt-2">
              <div className="flex items-center gap-2">
                <span>{comment.author}</span>
                <span>•</span>
                <span>{comment.createdAt}</span>
              </div>
              <div className="flex gap-2">
                {comment.content.length > 100 && (
                  <button 
                    onClick={() => toggleExpand(comment.id)}
                    className="text-primary hover:underline text-xs"
                  >
                    {isExpanded ? 'Show less' : 'Show more'}
                  </button>
                )}
                <button
                  onClick={() => handleReadAloud(comment)}
                  className="text-primary hover:underline text-xs ml-2"
                  aria-label="Read aloud"
                >
                  Read aloud
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CommentList;
