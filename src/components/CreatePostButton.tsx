
import React from 'react';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CreatePostButtonProps {
  onClick: () => void;
}

const CreatePostButton: React.FC<CreatePostButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "fixed bottom-6 right-6 z-50 flex items-center justify-center",
        "w-14 h-14 rounded-full bg-primary text-white shadow-lg",
        "transform transition-all duration-300 ease-in-out",
        "hover:scale-105 hover:shadow-xl active:scale-95",
        "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2"
      )}
      aria-label="Create new post"
    >
      <Plus size={24} />
    </button>
  );
};

export default CreatePostButton;
