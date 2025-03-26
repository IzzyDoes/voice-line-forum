
import React, { useState } from 'react';
import { Toaster } from 'sonner';
import { useUser } from '@clerk/clerk-react';
import { CommentType } from '@/components/Comment';
import CommentList from '@/components/CommentList';
import CreatePostButton from '@/components/CreatePostButton';
import CreatePostModal from '@/components/CreatePostModal';

const Index: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [comments, setComments] = useState<CommentType[]>([]);
  const { isSignedIn, user } = useUser();

  const handleCreatePost = (title: string, content: string) => {
    const newComment: CommentType = {
      id: Date.now().toString(),
      title,
      content,
      author: user?.fullName || user?.username || 'Anonymous',
      createdAt: 'Just now'
    };
    
    setComments([newComment, ...comments]);
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

      <div className="space-y-4">
        <CommentList />
      </div>

      {isSignedIn && (
        <CreatePostButton onClick={() => setIsModalOpen(true)} />
      )}
      
      {isSignedIn && (
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
