
import React, { useState } from 'react';
import { Shield, Trash2, User, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

// Mock data for users and posts
const MOCK_USERS = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'user' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'user' },
  { id: '3', name: 'Admin User', email: 'admin@example.com', role: 'admin' },
];

const MOCK_POSTS = [
  { id: '101', title: 'First Post', author: 'John Doe', createdAt: '2 days ago' },
  { id: '102', title: 'Second Post', author: 'Jane Smith', createdAt: '1 day ago' },
  { id: '103', title: 'Admin Announcement', author: 'Admin User', createdAt: '5 hours ago' },
];

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'posts'>('users');
  const [users, setUsers] = useState(MOCK_USERS);
  const [posts, setPosts] = useState(MOCK_POSTS);

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId));
    toast.success('User deleted successfully');
  };

  const handleDeletePost = (postId: string) => {
    setPosts(posts.filter(post => post.id !== postId));
    toast.success('Post deleted successfully');
  };

  return (
    <div className="container py-8 animate-fade-in max-w-4xl">
      <div className="mb-8">
        <div className="space-y-1 pb-6 border-b">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Shield className="text-primary" size={28} />
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage users and content of the political forum
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 font-medium text-sm flex items-center gap-2 ${
            activeTab === 'users' 
              ? 'border-b-2 border-primary text-primary' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
          onClick={() => setActiveTab('users')}
        >
          <User size={16} />
          Users
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm flex items-center gap-2 ${
            activeTab === 'posts' 
              ? 'border-b-2 border-primary text-primary' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
          onClick={() => setActiveTab('posts')}
        >
          <MessageSquare size={16} />
          Posts
        </button>
      </div>

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Email</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Role</th>
                    <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b">
                      <td className="px-4 py-3 text-sm">{user.name}</td>
                      <td className="px-4 py-3 text-sm">{user.email}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.role === 'admin' 
                            ? 'bg-primary/10 text-primary' 
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-right">
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-destructive hover:text-destructive/80 p-1 rounded-full"
                          disabled={user.role === 'admin'}
                          title={user.role === 'admin' ? "Cannot delete admin users" : "Delete user"}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Posts Tab */}
      {activeTab === 'posts' && (
        <div className="space-y-4">
          <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-3 text-left text-sm font-medium">Title</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Author</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Created</th>
                    <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <tr key={post.id} className="border-b">
                      <td className="px-4 py-3 text-sm">{post.title}</td>
                      <td className="px-4 py-3 text-sm">{post.author}</td>
                      <td className="px-4 py-3 text-sm">{post.createdAt}</td>
                      <td className="px-4 py-3 text-sm text-right">
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="text-destructive hover:text-destructive/80 p-1 rounded-full"
                          title="Delete post"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
