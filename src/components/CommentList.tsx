
import React from 'react';
import Comment, { CommentType } from './Comment';

// Sample data
const SAMPLE_COMMENTS: CommentType[] = [
  {
    id: '1',
    title: 'Healthcare Reform Needed',
    content: 'I believe our healthcare system needs major reform. The current approach is leaving too many people without access to proper medical care. We should consider models from other countries that provide universal coverage while maintaining quality and innovation.',
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
  return (
    <div className="space-y-4">
      {SAMPLE_COMMENTS.map((comment) => (
        <Comment key={comment.id} comment={comment} />
      ))}
    </div>
  );
};

export default CommentList;
