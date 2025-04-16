
import React, { useState, useEffect } from 'react';
import Comment, { CommentType } from './Comment';
import { useSettings } from '@/contexts/SettingsContext';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  ChevronDown,
  Clock, 
  ThumbsUp, 
  ThumbsDown, 
  MessageSquare 
} from 'lucide-react';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';

// Props interface for CommentList
interface CommentListProps {
  comments: CommentType[];
  onUpvote: (id: string) => void;
  onDownvote: (id: string) => void;
}

const CommentList: React.FC<CommentListProps> = ({ comments, onUpvote, onDownvote }) => {
  const [sortBy, setSortBy] = useState<'newest' | 'mostUpvoted' | 'mostCommented' | 'mostDownvoted'>('newest');
  const { speakText } = useSettings();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 5; // 5 posts per page as requested

  // Filter comments based on search query
  const filteredComments = comments.filter(comment => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      comment.title.toLowerCase().includes(searchTerm) ||
      comment.content.toLowerCase().includes(searchTerm) ||
      comment.author.toLowerCase().includes(searchTerm)
    );
  });

  // Sort comments based on selected sort option
  const sortedComments = [...filteredComments].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        // Simple sorting by "recency" based on our sample data
        return a.createdAt < b.createdAt ? -1 : 1;
      case 'mostUpvoted':
        return b.upvotes - a.upvotes;
      case 'mostCommented':
        const aComments = a.comments?.length || 0;
        const bComments = b.comments?.length || 0;
        return bComments - aComments;
      case 'mostDownvoted':
        return b.downvotes - a.downvotes;
      default:
        return 0;
    }
  });

  // Get current comments for pagination
  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments = sortedComments.slice(indexOfFirstComment, indexOfLastComment);
  const totalPages = Math.ceil(sortedComments.length / commentsPerPage);

  // Reset to first page when search query or sort option changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortBy]);

  const handleReadAloud = (comment: CommentType) => {
    const textToRead = `${comment.title}. ${comment.content}`;
    speakText(textToRead);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const sortLabels = {
    newest: 'Most Recent',
    mostUpvoted: 'Most Upvoted',
    mostCommented: 'Most Commented',
    mostDownvoted: 'Most Downvoted'
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-2 md:items-center justify-between mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search posts by title, content, or author..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-1 whitespace-nowrap">
              <span>Sort by: {sortLabels[sortBy]}</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-40 z-50 bg-background">
            <DropdownMenuItem onClick={() => setSortBy('newest')} className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Most Recent</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy('mostUpvoted')} className="flex items-center gap-2">
              <ThumbsUp className="h-4 w-4" />
              <span>Most Upvoted</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy('mostCommented')} className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span>Most Commented</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy('mostDownvoted')} className="flex items-center gap-2">
              <ThumbsDown className="h-4 w-4" />
              <span>Most Downvoted</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {currentComments.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No posts found matching your search.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {currentComments.map((comment) => (
            <Comment 
              key={comment.id} 
              comment={comment} 
              onUpvote={onUpvote}
              onDownvote={onDownvote}
            />
          ))}
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
