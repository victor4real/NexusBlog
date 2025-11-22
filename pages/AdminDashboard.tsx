import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { dataService } from '../services/dataService';
import { User, Comment, Post, UserRole } from '../types';
import { CATEGORIES } from '../constants';
import { Shield, Users, MessageSquare, FileText, Check, X, AlertTriangle, Share2, Pause, Play, Facebook, Twitter, ChevronLeft, ChevronRight, Plus } from 'lucide-react';

const ITEMS_PER_PAGE = 5;

export const AdminDashboard = () => {
  const { user, isAdmin, isModerator } = useAuth();
  const [activeTab, setActiveTab] = useState<'users' | 'comments' | 'posts'>('posts');
  
  const [users, setUsers] = useState<User[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [refresh, setRefresh] = useState(0);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Create Post Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'Technology',
    image_url: 'https://picsum.photos/id/10/800/400',
    is_published: false
  });

  useEffect(() => {
    const fetchData = async () => {
      if (activeTab === 'users' && isAdmin) {
        const u = await dataService.getAllUsers();
        setUsers(u);
      }
      if (activeTab === 'comments') {
        const c = await dataService.getAllComments();
        // Sort pending first
        setComments(c.sort((a, b) => (a.status === 'pending' ? -1 : 1)));
      }
      if (activeTab === 'posts') {
        const p = await dataService.getPosts(false); // Get all including drafts
        setPosts(p);
      }
    };
    fetchData();
  }, [activeTab, isAdmin, refresh]);

  // Reset to page 1 when switching tabs
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  if (!isAdmin && !isModerator) {
    return <div className="p-10 text-center text-red-500">Access Denied</div>;
  }

  const handleModerateComment = async (id: string, status: 'approved' | 'rejected') => {
    await dataService.updateCommentStatus(id, status);
    setRefresh(p => p + 1);
  };

  const handleToggleSuspend = async (id: string) => {
    if(!confirm("Are you sure?")) return;
    await dataService.toggleUserSuspension(id);
    setRefresh(p => p + 1);
  };

  const handleTogglePublish = async (id: string) => {
    await dataService.togglePublishStatus(id);
    setRefresh(p => p + 1);
  };

  const handleSocialPost = async (id: string, platform: 'facebook' | 'twitter') => {
    if(!confirm(`Post to ${platform}?`)) return;
    await dataService.publishToSocial(id, platform);
    alert(`Successfully queued for ${platform}`);
    setRefresh(p => p + 1);
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.title || !newPost.content) {
      alert("Title and Content are required");
      return;
    }

    await dataService.createPost({
      ...newPost,
      author: user?.name || 'Admin',
      published_at: new Date().toISOString()
    });

    setIsCreateModalOpen(false);
    setNewPost({
      title: '',
      excerpt: '',
      content: '',
      category: 'Technology',
      image_url: 'https://picsum.photos/id/10/800/400',
      is_published: false
    });
    setRefresh(p => p + 1);
  };

  // Pagination Helper
  const getPaginatedData = <T,>(data: T[]): T[] => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return data.slice(startIndex, endIndex);
  };

  const renderPagination = (totalItems: number) => {
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    
    if (totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
        <div className="flex flex-1 justify-between sm:hidden">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{((currentPage - 1) * ITEMS_PER_PAGE) + 1}</span> to <span className="font-medium">{Math.min(currentPage * ITEMS_PER_PAGE, totalItems)}</span> of <span className="font-medium">{totalItems}</span> results
            </p>
          </div>
          <div>
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
              >
                <span className="sr-only">Previous</span>
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  aria-current={currentPage === i + 1 ? 'page' : undefined}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                    currentPage === i + 1
                      ? 'bg-primary text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
                      : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
              >
                <span className="sr-only">Next</span>
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
           <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Shield className="w-8 h-8 text-primary mr-2" />
            Admin Control Panel
           </h1>
           <p className="text-gray-500 mt-1">Manage content, users, and community safety.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('posts')}
            className={`${activeTab === 'posts' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <FileText className="w-4 h-4 mr-2" /> Posts & Content
          </button>
          <button
            onClick={() => setActiveTab('comments')}
            className={`${activeTab === 'comments' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <MessageSquare className="w-4 h-4 mr-2" /> Moderation Queue
          </button>
          {isAdmin && (
            <button
              onClick={() => setActiveTab('users')}
              className={`${activeTab === 'users' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <Users className="w-4 h-4 mr-2" /> User Management
            </button>
          )}
        </nav>
      </div>

      {/* Content Area */}
      <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
        
        {/* POSTS TAB */}
        {activeTab === 'posts' && (
          <div className="flex flex-col">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
               <h3 className="text-lg font-medium text-gray-900">All Articles</h3>
               <button 
                 onClick={() => setIsCreateModalOpen(true)}
                 className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
               >
                 <Plus className="w-4 h-4 mr-2" />
                 New Post
               </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Social</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {getPaginatedData(posts).map(post => (
                    <tr key={post.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 truncate max-w-xs">{post.title}</div>
                        <div className="text-xs text-gray-500">{new Date(post.published_at).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{post.author}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${post.is_published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {post.is_published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          <Facebook className={`w-4 h-4 ${post.social_posted.facebook ? 'text-blue-600' : 'text-gray-300'}`} />
                          <Twitter className={`w-4 h-4 ${post.social_posted.twitter ? 'text-sky-500' : 'text-gray-300'}`} />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => handleTogglePublish(post.id)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                          {post.is_published ? 'Unpublish' : 'Publish'}
                        </button>
                        {post.is_published && (
                          <button 
                              onClick={() => handleSocialPost(post.id, 'twitter')}
                              className="text-sky-500 hover:text-sky-700"
                              disabled={post.social_posted.twitter}
                          >
                            {post.social_posted.twitter ? 'Posted' : 'Post to X'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {renderPagination(posts.length)}
          </div>
        )}

        {/* COMMENTS TAB */}
        {activeTab === 'comments' && (
          <div className="flex flex-col">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comment</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {getPaginatedData(comments).map(comment => (
                    <tr key={comment.id} className={comment.status === 'pending' ? 'bg-orange-50' : ''}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {comment.user_name}
                          <div className="text-xs text-gray-400">{comment.user_id}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-md break-words">
                        {comment.content}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${comment.status === 'approved' ? 'bg-green-100 text-green-800' : 
                            comment.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                            comment.status === 'flagged' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'}`}>
                          {comment.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {comment.status === 'pending' || comment.status === 'flagged' ? (
                          <div className="flex justify-end space-x-2">
                            <button onClick={() => handleModerateComment(comment.id, 'approved')} className="text-green-600 hover:text-green-900 p-1 border border-green-200 rounded">
                              <Check className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleModerateComment(comment.id, 'rejected')} className="text-red-600 hover:text-red-900 p-1 border border-red-200 rounded">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-xs">Moderated</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {renderPagination(comments.length)}
          </div>
        )}

        {/* USERS TAB */}
        {activeTab === 'users' && (
          <div className="flex flex-col">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {getPaginatedData(users).map(u => (
                    <tr key={u.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold mr-3">
                              {u.name.charAt(0)}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{u.name}</div>
                            <div className="text-xs text-gray-500">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {u.role}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {u.is_suspended ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Suspended</span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => handleToggleSuspend(u.id)}
                          className={`${u.is_suspended ? 'text-green-600 hover:text-green-900' : 'text-red-600 hover:text-red-900'}`}
                        >
                          {u.is_suspended ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {renderPagination(users.length)}
          </div>
        )}

      </div>

      {/* Create Post Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setIsCreateModalOpen(false)}></div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">Create New Post</h3>
                  <button onClick={() => setIsCreateModalOpen(false)} className="text-gray-400 hover:text-gray-500">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <form onSubmit={handleCreatePost}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Title</label>
                      <input 
                        type="text" 
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                        value={newPost.title}
                        onChange={e => setNewPost({...newPost, title: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Excerpt</label>
                      <input 
                        type="text" 
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                        value={newPost.excerpt}
                        onChange={e => setNewPost({...newPost, excerpt: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Content</label>
                      <textarea 
                        rows={5}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                        value={newPost.content}
                        onChange={e => setNewPost({...newPost, content: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Category</label>
                        <select 
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                          value={newPost.category}
                          onChange={e => setNewPost({...newPost, category: e.target.value})}
                        >
                          {CATEGORIES.map(cat => (
                            <option key={cat.id} value={cat.name}>{cat.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Image URL</label>
                        <input 
                          type="text" 
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                          value={newPost.image_url}
                          onChange={e => setNewPost({...newPost, image_url: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="flex items-center mt-4">
                       <input
                        id="is_published"
                        name="is_published"
                        type="checkbox"
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                        checked={newPost.is_published}
                        onChange={e => setNewPost({...newPost, is_published: e.target.checked})}
                      />
                      <label htmlFor="is_published" className="ml-2 block text-sm text-gray-900">
                        Publish immediately
                      </label>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse -mx-6 -mb-6 mt-6 border-t border-gray-200 rounded-b-lg">
                    <button 
                      type="submit" 
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Create Post
                    </button>
                    <button 
                      type="button" 
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={() => setIsCreateModalOpen(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};