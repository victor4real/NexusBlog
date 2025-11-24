import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { dataService } from '../services/dataService';
import { User, Comment, Post, UserRole } from '../types';
import { CATEGORIES } from '../constants';
import { Shield, Users, MessageSquare, FileText, Check, X, AlertTriangle, Share2, Pause, Play, Facebook, Twitter, ChevronLeft, ChevronRight, Plus, Upload, Trash2, Edit2, Image as ImageIcon } from 'lucide-react';

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
  const [uploadingImage, setUploadingImage] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'Technology',
    image_url: 'https://picsum.photos/id/10/800/400',
    is_published: false
  });

  // User Management State
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (activeTab === 'users' && isAdmin) {
        const u = await dataService.getAllUsers();
        setUsers(u);
      }
      if (activeTab === 'comments') {
        const c = await dataService.getAllComments();
        setComments(c.sort((a, b) => (a.status === 'pending' ? -1 : 1)));
      }
      if (activeTab === 'posts') {
        const p = await dataService.getPosts(false);
        setPosts(p);
      }
    };
    fetchData();
  }, [activeTab, isAdmin, refresh]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  if (!isAdmin && !isModerator) {
    return <div className="p-10 text-center text-red-500">Access Denied</div>;
  }

  // --- Handlers ---

  const handleModerateComment = async (id: string, status: 'approved' | 'rejected') => {
    await dataService.updateCommentStatus(id, status);
    setRefresh(p => p + 1);
  };

  const handleToggleSuspend = async (id: string) => {
    if(!confirm("Are you sure?")) return;
    await dataService.toggleUserSuspension(id);
    setRefresh(p => p + 1);
  };

  const handleDeleteUser = async (id: string) => {
    if(!confirm("WARNING: This will delete the user profile and data. Proceed?")) return;
    try {
      await dataService.deleteUser(id);
      setRefresh(p => p + 1);
    } catch (e) {
      alert("Failed to delete user.");
    }
  };

  const handleUpdateRole = async (id: string, newRole: UserRole) => {
    await dataService.updateUserRole(id, newRole);
    setEditingUser(null);
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadingImage(true);
      try {
        const url = await dataService.uploadImage(e.target.files[0], 'post-images');
        if (url) {
           setNewPost({ ...newPost, image_url: url });
        }
      } catch (err) {
        alert("Image upload failed");
      } finally {
        setUploadingImage(false);
      }
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.title || !newPost.content) {
      alert("Title and Content are required");
      return;
    }

    try {
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
      alert("Post created successfully!");
    } catch (error) {
      alert("Failed to create post. See console.");
    }
  };

  function getPaginatedData<T>(data: T[]): T[] {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return data.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }

  const renderPagination = (totalItems: number) => {
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    if (totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
        <div className="flex flex-1 justify-between sm:hidden">
           <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">Previous</button>
           <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">Next</button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">Showing <span className="font-medium">{((currentPage - 1) * ITEMS_PER_PAGE) + 1}</span> to <span className="font-medium">{Math.min(currentPage * ITEMS_PER_PAGE, totalItems)}</span> of <span className="font-medium">{totalItems}</span> results</p>
          </div>
          <div>
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"><ChevronLeft className="h-5 w-5" /></button>
              {[...Array(totalPages)].map((_, i) => (
                <button key={i + 1} onClick={() => setCurrentPage(i + 1)} className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${currentPage === i + 1 ? 'bg-primary text-white' : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'}`}>{i + 1}</button>
              ))}
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"><ChevronRight className="h-5 w-5" /></button>
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

      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button onClick={() => setActiveTab('posts')} className={`${activeTab === 'posts' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'} py-4 px-1 border-b-2 font-medium text-sm flex items-center`}>
            <FileText className="w-4 h-4 mr-2" /> Posts & Content
          </button>
          <button onClick={() => setActiveTab('comments')} className={`${activeTab === 'comments' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'} py-4 px-1 border-b-2 font-medium text-sm flex items-center`}>
            <MessageSquare className="w-4 h-4 mr-2" /> Moderation Queue
          </button>
          {isAdmin && (
            <button onClick={() => setActiveTab('users')} className={`${activeTab === 'users' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'} py-4 px-1 border-b-2 font-medium text-sm flex items-center`}>
              <Users className="w-4 h-4 mr-2" /> User Management
            </button>
          )}
        </nav>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
        
        {/* POSTS */}
        {activeTab === 'posts' && (
          <div className="flex flex-col">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
               <h3 className="text-lg font-medium text-gray-900">All Articles</h3>
               <button onClick={() => setIsCreateModalOpen(true)} className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-primary hover:bg-blue-700">
                 <Plus className="w-4 h-4 mr-2" /> New Post
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
                  {getPaginatedData<Post>(posts).map(post => (
                    <tr key={post.id}>
                      <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900 truncate max-w-xs">{post.title}</div></td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{post.author}</td>
                      <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${post.is_published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{post.is_published ? 'Published' : 'Draft'}</span></td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          <Facebook className={`w-4 h-4 ${post.social_posted.facebook ? 'text-blue-600' : 'text-gray-300'}`} />
                          <Twitter className={`w-4 h-4 ${post.social_posted.twitter ? 'text-sky-500' : 'text-gray-300'}`} />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => handleTogglePublish(post.id)} className="text-indigo-600 hover:text-indigo-900 mr-4">{post.is_published ? 'Unpublish' : 'Publish'}</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {renderPagination(posts.length)}
          </div>
        )}

        {/* COMMENTS */}
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
                  {getPaginatedData<Comment>(comments).map(comment => (
                    <tr key={comment.id} className={comment.status === 'pending' ? 'bg-orange-50' : ''}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{comment.user_name}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-md break-words">{comment.content}</td>
                      <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${comment.status === 'approved' ? 'bg-green-100 text-green-800' : comment.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>{comment.status}</span></td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                         {comment.status === 'pending' && (
                           <>
                             <button onClick={() => handleModerateComment(comment.id, 'approved')} className="text-green-600 hover:text-green-900 mr-2"><Check className="w-4 h-4" /></button>
                             <button onClick={() => handleModerateComment(comment.id, 'rejected')} className="text-red-600 hover:text-red-900"><X className="w-4 h-4" /></button>
                           </>
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

        {/* USERS */}
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
                  {getPaginatedData<User>(users).map(u => (
                    <tr key={u.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-3 overflow-hidden">
                             {u.avatar_url ? <img src={u.avatar_url} className="h-full w-full object-cover"/> : u.name.charAt(0)}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{u.name}</div>
                            <div className="text-xs text-gray-500">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                         {editingUser?.id === u.id ? (
                           <select 
                            className="text-xs border rounded p-1"
                            value={u.role}
                            onChange={(e) => handleUpdateRole(u.id, e.target.value as UserRole)}
                           >
                             <option value="user">User</option>
                             <option value="moderator">Moderator</option>
                             <option value="admin">Admin</option>
                           </select>
                         ) : (
                           <span className="flex items-center">
                             {u.role}
                             <button onClick={() => setEditingUser(u)} className="ml-2 text-gray-400 hover:text-primary"><Edit2 className="w-3 h-3"/></button>
                           </span>
                         )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                         <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${u.is_suspended ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                           {u.is_suspended ? 'Suspended' : 'Active'}
                         </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => handleToggleSuspend(u.id)} className={`mr-3 ${u.is_suspended ? 'text-green-600' : 'text-yellow-600'}`}>
                          {u.is_suspended ? <Play className="w-4 h-4" title="Activate"/> : <Pause className="w-4 h-4" title="Suspend"/>}
                        </button>
                        <button onClick={() => handleDeleteUser(u.id)} className="text-red-600 hover:text-red-900">
                          <Trash2 className="w-4 h-4" title="Delete User"/>
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

      {/* CREATE POST MODAL - COMPREHENSIVE */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setIsCreateModalOpen(false)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <form onSubmit={handleCreatePost}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="flex justify-between items-center mb-6 border-b pb-2">
                    <h3 className="text-xl leading-6 font-bold text-gray-900" id="modal-title">Create New Article</h3>
                    <button type="button" onClick={() => setIsCreateModalOpen(false)} className="text-gray-400 hover:text-gray-500"><X className="w-6 h-6" /></button>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Editor */}
                    <div className="lg:col-span-2 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Title</label>
                        <input 
                          type="text" 
                          required
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-lg font-serif"
                          placeholder="Enter a catchy headline..."
                          value={newPost.title}
                          onChange={e => setNewPost({...newPost, title: e.target.value})}
                        />
                      </div>
                      
                      <div>
                         <label className="block text-sm font-medium text-gray-700">Content</label>
                         <textarea 
                           rows={12}
                           required
                           className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm font-mono"
                           placeholder="Write your story here..."
                           value={newPost.content}
                           onChange={e => setNewPost({...newPost, content: e.target.value})}
                         />
                      </div>
                    </div>

                    {/* Right Column: Meta & Preview */}
                    <div className="space-y-6">
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h4 className="font-bold text-sm text-gray-700 mb-3">Publishing Details</h4>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-500">Category</label>
                            <select 
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                              value={newPost.category}
                              onChange={e => setNewPost({...newPost, category: e.target.value})}
                            >
                              {CATEGORIES.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500">Excerpt</label>
                            <textarea 
                              rows={3}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-xs"
                              value={newPost.excerpt}
                              onChange={e => setNewPost({...newPost, excerpt: e.target.value})}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h4 className="font-bold text-sm text-gray-700 mb-3">Featured Image</h4>
                        
                        {newPost.image_url ? (
                          <div className="mb-3 relative group">
                            <img src={newPost.image_url} alt="Preview" className="w-full h-32 object-cover rounded-md" />
                            <button type="button" onClick={() => setNewPost({...newPost, image_url: ''})} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-3 h-3"/></button>
                          </div>
                        ) : (
                          <div className="mb-3 border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center text-gray-400">
                            <ImageIcon className="w-8 h-8 mb-2" />
                            <span className="text-xs">No image selected</span>
                          </div>
                        )}

                        <div className="relative">
                           <input 
                             type="file" 
                             accept="image/*"
                             id="post-image-upload"
                             className="hidden"
                             onChange={handleImageUpload}
                             disabled={uploadingImage}
                           />
                           <label 
                             htmlFor="post-image-upload"
                             className={`w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 cursor-pointer ${uploadingImage ? 'opacity-50' : ''}`}
                           >
                             <Upload className="w-4 h-4 mr-2" />
                             {uploadingImage ? 'Uploading...' : 'Upload Image'}
                           </label>
                        </div>
                        <div className="mt-2 text-center text-xs text-gray-500">- OR -</div>
                        <input 
                          type="text" 
                          placeholder="Paste Image URL"
                          className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-3 text-xs"
                          value={newPost.image_url}
                          onChange={e => setNewPost({...newPost, image_url: e.target.value})}
                        />
                      </div>

                      <div className="flex items-center">
                         <input
                          id="is_published"
                          type="checkbox"
                          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                          checked={newPost.is_published}
                          onChange={e => setNewPost({...newPost, is_published: e.target.checked})}
                        />
                        <label htmlFor="is_published" className="ml-2 block text-sm text-gray-900">
                          Publish Immediately
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200">
                  <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:ml-3 sm:w-auto sm:text-sm">
                    Create Post
                  </button>
                  <button type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" onClick={() => setIsCreateModalOpen(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};