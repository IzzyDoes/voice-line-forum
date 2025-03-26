
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

// Enhanced sample data with upvotes, downvotes and comments
const SAMPLE_COMMENTS: CommentType[] = [
  {
    id: '1',
    title: 'Healthcare Reform Needed',
    content: "I believe our healthcare system needs major reform. The current approach is leaving too many people without access to proper medical care. We should consider models from other countries that provide universal coverage while maintaining quality and innovation.",
    author: 'PolicyWonk',
    createdAt: '2 hours ago',
    upvotes: 24,
    downvotes: 3,
    comments: [
      {
        id: '1-1',
        content: 'I completely agree. Universal healthcare is a human right.',
        author: 'HealthcareAdvocate',
        createdAt: '1 hour ago',
        upvotes: 8,
        downvotes: 1
      },
      {
        id: '1-2',
        content: 'We need to balance coverage with maintaining innovation in the healthcare system.',
        author: 'BalancedView',
        createdAt: '45 min ago',
        upvotes: 6,
        downvotes: 2
      },
      {
        id: '1-3',
        content: 'What about the costs? How would we fund this?',
        author: 'FiscalConcern',
        createdAt: '30 min ago',
        upvotes: 4,
        downvotes: 1
      }
    ]
  },
  {
    id: '2',
    title: 'Tax Policy Concerns',
    content: 'The latest tax proposal would put an unfair burden on middle-class families while giving unnecessary breaks to corporations. We need to reconsider our priorities and create a more equitable tax system that funds important programs without crushing average citizens.',
    author: 'EconomicThinker',
    createdAt: '5 hours ago',
    upvotes: 18,
    downvotes: 5,
    comments: [
      {
        id: '2-1',
        content: 'Corporate tax cuts can stimulate economic growth, though.',
        author: 'EconStudent',
        createdAt: '4 hours ago',
        upvotes: 3,
        downvotes: 7
      },
      {
        id: '2-2',
        content: 'The middle class has been carrying too much of the burden for too long.',
        author: 'ClassAdvocate',
        createdAt: '3 hours ago',
        upvotes: 12,
        downvotes: 0
      }
    ]
  },
  {
    id: '3',
    title: 'Climate Action Is Urgent',
    content: "We cannot continue to delay meaningful action on climate change. The science is clear, and we're already seeing the impacts. We need bold policy initiatives that transition us to clean energy without leaving workers behind.",
    author: 'GreenFuture',
    createdAt: '1 day ago',
    upvotes: 42,
    downvotes: 8,
    comments: []
  },
  {
    id: '4',
    title: 'Education Funding Gap',
    content: 'The disparity in education funding between wealthy and poor districts continues to grow. Every child deserves access to quality education regardless of zip code. We should implement funding reforms that address these inequities.',
    author: 'TeachForAll',
    createdAt: '2 days ago',
    upvotes: 31,
    downvotes: 2,
    comments: [
      {
        id: '4-1',
        content: 'Local control of schools is important too.',
        author: 'LocalGov',
        createdAt: '1 day ago',
        upvotes: 5,
        downvotes: 8
      }
    ]
  },
  {
    id: '5',
    title: 'Infrastructure Investment',
    content: "Our nation's infrastructure is crumbling, and it's holding back economic growth. We need a comprehensive plan to rebuild roads, bridges, airports, and digital infrastructure. This would create jobs and boost productivity.",
    author: 'BuildItBetter',
    createdAt: '3 days ago',
    upvotes: 27,
    downvotes: 4,
    comments: []
  },
  {
    id: '6',
    title: 'Social Security Stability',
    content: "We need to ensure the long-term stability of Social Security. The program is vital for millions of retirees, and we need to strengthen it for future generations without cutting benefits for current recipients.",
    author: 'FuturePlanner',
    createdAt: '4 days ago',
    upvotes: 19,
    downvotes: 3,
    comments: []
  },
  {
    id: '7',
    title: 'Immigration Reform',
    content: "Our immigration system is broken and needs comprehensive reform. We need policies that are humane, fair, and serve our national interests while respecting human rights and family unity.",
    author: 'BorderPolicy',
    createdAt: '5 days ago',
    upvotes: 22,
    downvotes: 11,
    comments: []
  },
  {
    id: '8',
    title: 'Criminal Justice Reform',
    content: "The criminal justice system needs significant reforms to address racial disparities, reduce recidivism, and focus on rehabilitation rather than just punishment.",
    author: 'JusticeAdvocate',
    createdAt: '6 days ago',
    upvotes: 38,
    downvotes: 6,
    comments: []
  },
];

type SortOption = 'newest' | 'mostUpvoted' | 'mostCommented' | 'mostDownvoted';

const sortLabels: Record<SortOption, string> = {
  newest: 'Most Recent',
  mostUpvoted: 'Most Upvoted',
  mostCommented: 'Most Commented',
  mostDownvoted: 'Most Downvoted'
};

const CommentList: React.FC = () => {
  const [comments, setComments] = useState<CommentType[]>(SAMPLE_COMMENTS);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
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

  const handleUpvote = (id: string) => {
    setComments(prevComments =>
      prevComments.map(comment =>
        comment.id === id
          ? { ...comment, upvotes: comment.upvotes + 1 }
          : comment
      )
    );
  };

  const handleDownvote = (id: string) => {
    setComments(prevComments =>
      prevComments.map(comment =>
        comment.id === id
          ? { ...comment, downvotes: comment.downvotes + 1 }
          : comment
      )
    );
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
              onUpvote={handleUpvote}
              onDownvote={handleDownvote}
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
