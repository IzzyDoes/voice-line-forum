
import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'sonner';
import { CommentType } from '@/components/Comment';
import CommentList from '@/components/CommentList';
import CreatePostButton from '@/components/CreatePostButton';
import CreatePostModal from '@/components/CreatePostModal';
import { postsApi, authApi } from '@/api';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from 'lucide-react';

const Index: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [posts, setPosts] = useState<CommentType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortOption, setSortOption] = useState('recent');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        if (authApi.isAuthenticated()) {
          const userData = await authApi.getCurrentUser();
          setCurrentUser(userData);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        // Clear token if it's invalid
        authApi.logout();
        setIsAuthenticated(false);
      }
    };
    
    checkAuth();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const response = await postsApi.getPosts(currentPage, sortOption);
        
        // Transform the data to match CommentType format
        const formattedPosts = response.posts.map((post: any) => ({
          id: post.id.toString(),
          title: post.title,
          content: post.content,
          author: post.username || 'Anonymous',
          createdAt: new Date(post.created_at).toLocaleString(),
          upvotes: post.upvotes,
          downvotes: post.downvotes,
          comments: post.comment_count ? [] : undefined, // Just to indicate there are comments
        }));
        
        setPosts(formattedPosts);
        setTotalPages(response.pagination.pages);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch posts');
        toast.error('Failed to load posts');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [currentPage, sortOption]);

  const handleCreatePost = async (title: string, content: string) => {
    try {
      if (!isAuthenticated) {
        toast.error('You must be logged in to create a post');
        return;
      }
      
      await postsApi.createPost(title, content);
      toast.success('Post created successfully!');
      setIsModalOpen(false);
      
      // Refresh posts
      const response = await postsApi.getPosts(1, sortOption);
      const formattedPosts = response.posts.map((post: any) => ({
        id: post.id.toString(),
        title: post.title,
        content: post.content,
        author: post.username || 'Anonymous',
        createdAt: new Date(post.created_at).toLocaleString(),
        upvotes: post.upvotes,
        downvotes: post.downvotes,
        comments: post.comment_count ? [] : undefined,
      }));
      
      setPosts(formattedPosts);
      setCurrentPage(1);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to create post');
    }
  };

  const handleUpvote = async (id: string) => {
    try {
      if (!isAuthenticated) {
        toast.error('You must be logged in to vote');
        return;
      }
      
      await postsApi.upvotePost(id);
      
      // Update the post in the local state
      setPosts(posts.map(post => 
        post.id === id ? { 
          ...post, 
          upvotes: post.upvotes + 1 
        } : post
      ));
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to upvote');
    }
  };

  const handleDownvote = async (id: string) => {
    try {
      if (!isAuthenticated) {
        toast.error('You must be logged in to vote');
        return;
      }
      
      await postsApi.downvotePost(id);
      
      // Update the post in the local state
      setPosts(posts.map(post => 
        post.id === id ? { 
          ...post, 
          downvotes: post.downvotes + 1 
        } : post
      ));
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to downvote');
    }
  };
  
  const renderPagination = () => {
    return (
      <div className="flex justify-center mt-8 gap-2">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded border disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-3 py-1">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded border disabled:opacity-50"
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <div className="container py-8 animate-fade-in max-w-2xl">
      <div className="mb-8">
        <div className="space-y-1 pb-6 border-b">
          <h1 className="text-3xl font-bold tracking-tight">LeftPlot</h1>
          <p className="text-muted-foreground">
            A space to voice your political opinions and engage in respectful debate.
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="text-sm text-muted-foreground">
          {isLoading ? 'Loading posts...' : `Showing ${posts.length} posts`}
        </div>
        
        <Select
          value={sortOption}
          onValueChange={(value) => {
            setSortOption(value);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="upvotes">Most Upvoted</SelectItem>
            <SelectItem value="downvotes">Most Downvoted</SelectItem>
            <SelectItem value="comments">Most Commented</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin h-8 w-8 text-primary" />
        </div>
      ) : error ? (
        <div className="py-10 text-center">
          <p className="text-destructive">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md"
          >
            Retry
          </button>
        </div>
      ) : posts.length === 0 ? (
        <div className="py-10 text-center border rounded-md">
          <p className="text-muted-foreground">No posts available.</p>
          {isAuthenticated && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md"
            >
              Create the first post
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="space-y-4">
            <CommentList 
              comments={posts} 
              onUpvote={handleUpvote} 
              onDownvote={handleDownvote} 
            />
          </div>
          
          {renderPagination()}
        </>
      )}

      {isAuthenticated && (
        <CreatePostButton onClick={() => setIsModalOpen(true)} />
      )}
      
      {isAuthenticated && (
        <CreatePostModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onCreatePost={handleCreatePost}
        />
      )}
      
      <Toaster position="top-center" />
    </div>
  );
};

export default Index;
