
import React, { useState, useEffect } from 'react';
import Comment, { CommentType } from './Comment';
import { useSettings } from '@/contexts/SettingsContext';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';

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
  },
  {
    id: '6',
    title: 'Social Security Stability',
    content: "We need to ensure the long-term stability of Social Security. The program is vital for millions of retirees, and we need to strengthen it for future generations without cutting benefits for current recipients.",
    author: 'FuturePlanner',
    createdAt: '4 days ago'
  },
  {
    id: '7',
    title: 'Immigration Reform',
    content: "Our immigration system is broken and needs comprehensive reform. We need policies that are humane, fair, and serve our national interests while respecting human rights and family unity.",
    author: 'BorderPolicy',
    createdAt: '5 days ago'
  },
  {
    id: '8',
    title: 'Criminal Justice Reform',
    content: "The criminal justice system needs significant reforms to address racial disparities, reduce recidivism, and focus on rehabilitation rather than just punishment.",
    author: 'JusticeAdvocate',
    createdAt: '6 days ago'
  },
];

const CommentList: React.FC = () => {
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const { speakText } = useSettings();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 5; // Updated to 5 posts per page

  // Filter comments based on search query
  const filteredComments = SAMPLE_COMMENTS.filter(comment => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      comment.title.toLowerCase().includes(searchTerm) ||
      comment.content.toLowerCase().includes(searchTerm) ||
      comment.author.toLowerCase().includes(searchTerm)
    );
  });

  // Get current comments for pagination
  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments = filteredComments.slice(indexOfFirstComment, indexOfLastComment);
  const totalPages = Math.ceil(filteredComments.length / commentsPerPage);

  // Reset to first page when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

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

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="space-y-4">
      <div className="relative mb-6">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search posts by title, content, or author..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {currentComments.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No posts found matching your search.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {currentComments.map((comment) => {
            const isExpanded = expandedComments[comment.id] || false;
            const displayContent = isExpanded 
              ? comment.content 
              : comment.content.length > 200  // Updated to 200 characters threshold
                ? `${comment.content.slice(0, 200)}...` 
                : comment.content;

            return (
              <div key={comment.id} className="rounded-lg border bg-card shadow-sm p-4">
                <h3 className="text-lg font-semibold mb-1">{comment.title}</h3>
                <p className="text-sm mb-2">{displayContent}</p>
                
                <div className="flex justify-between items-center text-xs text-muted-foreground mt-2">
                  <div className="flex items-center gap-2">
                    <span>{comment.author}</span>
                    <span>•</span>
                    <span className="whitespace-nowrap">{comment.createdAt}</span> {/* Ensure timestamp is always visible */}
                  </div>
                  <div className="flex gap-2">
                    {comment.content.length > 200 && ( // Updated to 200 characters threshold
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
      )}

      {totalPages > 1 && (
        <Pagination className="mt-6">
          <PaginationContent>
            {currentPage > 1 && (
              <PaginationItem>
                <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} href="#" />
              </PaginationItem>
            )}
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink 
                  href="#" 
                  isActive={page === currentPage}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            
            {currentPage < totalPages && (
              <PaginationItem>
                <PaginationNext onClick={() => handlePageChange(currentPage + 1)} href="#" />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default CommentList;
